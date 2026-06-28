import { IsNotEmpty, IsString, IsUUID, MaxLength } from "class-validator";

export class SendMessageDto {
  @IsUUID("4", { message: "O destinatario precisa ser um UUID valido" })
  @IsNotEmpty({ message: "O destinatario nao pode estar vazio" })
  receiverId: string;

  @IsUUID("4", { message: "O anuncio precisa ser um UUID valido" })
  @IsNotEmpty({ message: "O anuncio nao pode estar vazio" })
  listingId: string;

  @IsString({ message: "A mensagem precisa ser uma string" })
  @IsNotEmpty({ message: "A mensagem nao pode estar vazia" })
  @MaxLength(2000, { message: "A mensagem pode ter no maximo 2000 caracteres" })
  content: string;
}
