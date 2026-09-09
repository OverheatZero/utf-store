import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsUUID, MaxLength } from "class-validator";

export class SendMessageDto {
  @ApiProperty({
    description: "ID do destinatário da mensagem (UUID v4)",
    example: "c182bc22-9213-42cc-a292-12a838df29ab",
  })
  @IsUUID("4", { message: "O destinatario precisa ser um UUID valido" })
  @IsNotEmpty({ message: "O destinatario nao pode estar vazio" })
  receiverId: string;

  @ApiProperty({
    description: "ID do anúncio relacionado à conversa (UUID v4)",
    example: "d3b07384-d113-4ec2-a5d6-c0c21e7d8d29",
  })
  @IsUUID("4", { message: "O anuncio precisa ser um UUID valido" })
  @IsNotEmpty({ message: "O anuncio nao pode estar vazio" })
  listingId: string;

  @ApiProperty({
    description: "Conteúdo textual da mensagem (máximo de 2000 caracteres)",
    example: "Olá! O livro ainda está disponível para retirada?",
    maxLength: 2000,
  })
  @IsString({ message: "A mensagem precisa ser uma string" })
  @IsNotEmpty({ message: "A mensagem nao pode estar vazia" })
  @MaxLength(2000, { message: "A mensagem pode ter no maximo 2000 caracteres" })
  content: string;
}
