import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { type Prisma } from "generated/prisma/client";
import { ChatRepository } from "src/shared/database/repositories/chat.repositories";
import { FindMessagesQueryDto } from "./dto/find-messages-query.dto";
import { SendMessageDto } from "./dto/send-message.dto";

const messageInclude = {
  sender: {
    select: {
      id: true,
      name: true,
      email: true,
      avatarUrl: true,
      isVerified: true,
    },
  },
  receiver: {
    select: {
      id: true,
      name: true,
      email: true,
      avatarUrl: true,
      isVerified: true,
    },
  },
  listing: {
    select: {
      id: true,
      title: true,
      status: true,
    },
  },
} satisfies Prisma.MessageInclude;

@Injectable()
export class ChatService {
  constructor(private readonly chatRepo: ChatRepository) {}

  async sendMessage(senderId: string, sendMessageDto: SendMessageDto) {
    if (senderId === sendMessageDto.receiverId) {
      throw new BadRequestException("You cannot send a message to yourself");
    }

    await this.ensureUserExists(sendMessageDto.receiverId);
    await this.ensureListingExists(sendMessageDto.listingId);

    const message = await this.chatRepo.create({
      data: {
        senderId,
        receiverId: sendMessageDto.receiverId,
        listingId: sendMessageDto.listingId,
        content: sendMessageDto.content,
      },
      include: messageInclude,
    });

    return { message };
  }

  async findConversation(userId: string, query: FindMessagesQueryDto) {
    const messages = await this.chatRepo.findMany({
      where: {
        listingId: query.listingId,
        OR: [
          { senderId: userId, receiverId: query.userId },
          { senderId: query.userId, receiverId: userId },
        ],
      },
      include: messageInclude,
      orderBy: { createdAt: "asc" },
    });

    return { messages };
  }

  async markAsRead(userId: string, messageId: string) {
    const message = await this.chatRepo.findUnique({
      where: { id: messageId },
      select: { id: true, receiverId: true },
    });

    if (!message) throw new NotFoundException("Message not found");

    if (message.receiverId !== userId) {
      throw new ForbiddenException("You cannot mark this message as read");
    }

    const updatedMessage = await this.chatRepo.update({
      where: { id: messageId },
      data: { isRead: true },
      include: messageInclude,
    });

    return { message: updatedMessage };
  }

  private async ensureUserExists(userId: string) {
    const user = await this.chatRepo.findUserById(userId);

    if (!user) throw new NotFoundException("Receiver not found");
  }

  private async ensureListingExists(listingId: string) {
    const listing = await this.chatRepo.findListingById(listingId);

    if (!listing) throw new NotFoundException("Listing not found");
  }
}
