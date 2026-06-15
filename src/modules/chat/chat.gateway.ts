import { UsePipes, ValidationPipe } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { env } from "src/shared/config/env";
import { ChatService } from "./chat.service";
import { SendMessageDto } from "./dto/send-message.dto";

type JwtPayload = {
  sub?: string;
};

type ChatSocketData = {
  userId?: string;
};

@WebSocketGateway({
  namespace: "chat",
  cors: {
    origin: env.corsOrigin ?? true,
    credentials: true,
  },
})
export class ChatGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly chatService: ChatService,
    private readonly jwtService: JwtService,
  ) {}

  async handleConnection(client: Socket) {
    const token = this.extractToken(client);

    if (!token) {
      this.disconnectUnauthorized(client);
      return;
    }

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: env.jwtSecret,
      });

      if (!payload.sub) {
        this.disconnectUnauthorized(client);
        return;
      }

      this.setClientUserId(client, payload.sub);
      await client.join(this.getUserRoom(payload.sub));
    } catch {
      this.disconnectUnauthorized(client);
    }
  }

  @SubscribeMessage("message:send")
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async sendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() sendMessageDto: SendMessageDto,
  ) {
    const senderId = this.getClientUserId(client);

    if (!senderId) throw new WsException("Unauthorized");

    const result = await this.chatService.sendMessage(senderId, sendMessageDto);
    const receiverRoom = this.getUserRoom(result.message.receiverId);
    const senderRoom = this.getUserRoom(result.message.senderId);

    this.server.to(receiverRoom).emit("message:new", result);
    this.server.to(senderRoom).emit("message:new", result);

    return result;
  }

  private extractToken(client: Socket) {
    const authToken = client.handshake.auth?.token;

    if (typeof authToken === "string") return authToken;

    const authorization = client.handshake.headers.authorization;
    const [type, token] = authorization?.split(" ") ?? [];

    return type === "Bearer" ? token : undefined;
  }

  private getUserRoom(userId: string) {
    return `user:${userId}`;
  }

  private getClientUserId(client: Socket) {
    const data = client.data as ChatSocketData;

    return data.userId;
  }

  private setClientUserId(client: Socket, userId: string) {
    const data = client.data as ChatSocketData;

    data.userId = userId;
  }

  private disconnectUnauthorized(client: Socket) {
    client.emit("chat:error", { message: "Unauthorized" });
    client.disconnect(true);
  }
}
