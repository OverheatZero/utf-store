import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Query,
} from "@nestjs/common";
import { ActiveUserId } from "src/shared/decorators/ActiveUserId";
import { ChatService } from "./chat.service";
import { FindMessagesQueryDto } from "./dto/find-messages-query.dto";

@Controller("chat")
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get("messages")
  findConversation(
    @ActiveUserId() userId: string,
    @Query() query: FindMessagesQueryDto,
  ) {
    return this.chatService.findConversation(userId, query);
  }

  @Patch("messages/:id/read")
  markAsRead(
    @ActiveUserId() userId: string,
    @Param("id", ParseUUIDPipe) messageId: string,
  ) {
    return this.chatService.markAsRead(userId, messageId);
  }
}
