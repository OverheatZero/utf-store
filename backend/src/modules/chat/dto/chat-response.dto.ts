import { ApiProperty } from "@nestjs/swagger";

class ChatUserResponseDto {
  @ApiProperty({ example: "b21a8c3d-7485-4ae0-a292-02e0df2f3922" })
  id: string;

  @ApiProperty({ example: "example" })
  name: string;

  @ApiProperty({ example: "example@alunos.utfpr.edu.br" })
  email: string;

  @ApiProperty({
    example: "http://localhost:3000/uploads/profiles/avatar.png",
    nullable: true,
  })
  avatarUrl: string | null;

  @ApiProperty({ example: false })
  isVerified: boolean;
}

class ChatListingResponseDto {
  @ApiProperty({ example: "d3b07384-d113-4ec2-a5d6-c0c21e7d8d29" })
  id: string;

  @ApiProperty({ example: "Livro de Cálculo 1 - Guidorizzi" })
  title: string;

  @ApiProperty({ example: "ACTIVE" })
  status: string;
}

export class MessageDetailsResponseDto {
  @ApiProperty({ example: "a592bc13-8822-4822-ad0b-6893b827e8a9" })
  id: string;

  @ApiProperty({ example: "b21a8c3d-7485-4ae0-a292-02e0df2f3922" })
  senderId: string;

  @ApiProperty({ example: "c182bc22-9213-42cc-a292-12a838df29ab" })
  receiverId: string;

  @ApiProperty({ example: "d3b07384-d113-4ec2-a5d6-c0c21e7d8d29" })
  listingId: string;

  @ApiProperty({ example: "Olá! Ainda está disponível?" })
  content: string;

  @ApiProperty({ example: false })
  isRead: boolean;

  @ApiProperty({ example: "2026-06-28T18:49:08.000Z" })
  createdAt: Date;

  @ApiProperty({ type: ChatUserResponseDto })
  sender: ChatUserResponseDto;

  @ApiProperty({ type: ChatUserResponseDto })
  receiver: ChatUserResponseDto;

  @ApiProperty({ type: ChatListingResponseDto })
  listing: ChatListingResponseDto;
}

export class ConversationDetailsResponseDto {
  @ApiProperty({
    example:
      "d3b07384-d113-4ec2-a5d6-c0c21e7d8d29:c182bc22-9213-42cc-a292-12a838df29ab",
    description: "ID da conversa composto por 'listingId:otherUserId'",
  })
  id: string;

  @ApiProperty({ type: ChatListingResponseDto })
  listing: ChatListingResponseDto;

  @ApiProperty({ type: ChatUserResponseDto })
  contact: ChatUserResponseDto;

  @ApiProperty({ type: MessageDetailsResponseDto })
  lastMessage: MessageDetailsResponseDto;
}

export class MessageResponseDto {
  @ApiProperty({ type: MessageDetailsResponseDto })
  message: MessageDetailsResponseDto;
}

export class MessagesListResponseDto {
  @ApiProperty({ type: [MessageDetailsResponseDto] })
  messages: MessageDetailsResponseDto[];
}

export class ConversationsListResponseDto {
  @ApiProperty({ type: [ConversationDetailsResponseDto] })
  conversations: ConversationDetailsResponseDto[];
}
