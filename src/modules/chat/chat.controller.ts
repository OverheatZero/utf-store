import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Query,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { ActiveUserId } from "src/shared/decorators/ActiveUserId";
import { ChatService } from "./chat.service";
import {
  ConversationsListResponseDto,
  MessageResponseDto,
  MessagesListResponseDto,
} from "./dto/chat-response.dto";
import { FindMessagesQueryDto } from "./dto/find-messages-query.dto";

@ApiTags("Chat")
@ApiBearerAuth()
@Controller("chat")
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get("conversations")
  @ApiOperation({ summary: "Listar todas as conversas ativas do usuário autenticado" })
  @ApiResponse({
    status: 200,
    description: "Lista de conversas retornada com sucesso.",
    type: ConversationsListResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: "Não autorizado. Token de autenticação ausente ou inválido.",
  })
  findConversations(@ActiveUserId() userId: string) {
    return this.chatService.findConversations(userId);
  }

  @Get("messages")
  @ApiOperation({ summary: "Buscar o histórico de mensagens de uma conversa específica" })
  @ApiResponse({
    status: 200,
    description: "Histórico de mensagens retornado com sucesso.",
    type: MessagesListResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: "Não autorizado. Token de autenticação ausente ou inválido.",
  })
  findConversation(
    @ActiveUserId() userId: string,
    @Query() query: FindMessagesQueryDto,
  ) {
    return this.chatService.findConversation(userId, query);
  }

  @Patch("messages/:id/read")
  @ApiOperation({ summary: "Marcar uma mensagem recebida como lida" })
  @ApiResponse({
    status: 200,
    description: "Mensagem marcada como lida com sucesso.",
    type: MessageResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: "Não autorizado. Token de autenticação ausente ou inválido.",
  })
  @ApiResponse({
    status: 403,
    description: "Proibido. O usuário autenticado não é o destinatário desta mensagem.",
  })
  @ApiResponse({
    status: 404,
    description: "Mensagem não encontrada.",
  })
  markAsRead(
    @ActiveUserId() userId: string,
    @Param("id", ParseUUIDPipe) messageId: string,
  ) {
    return this.chatService.markAsRead(userId, messageId);
  }
}
