import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsUUID } from "class-validator";

export class FindMessagesQueryDto {
  @ApiProperty({
    description: "ID do anúncio relacionado à conversa (UUID v4)",
    example: "d3b07384-d113-4ec2-a5d6-c0c21e7d8d29",
  })
  @IsUUID("4", { message: "O anuncio precisa ser um UUID valido" })
  @IsNotEmpty({ message: "O anuncio nao pode estar vazio" })
  listingId: string;

  @ApiProperty({
    description: "ID do outro usuário participante da conversa (UUID v4)",
    example: "c182bc22-9213-42cc-a292-12a838df29ab",
  })
  @IsUUID("4", { message: "O usuario precisa ser um UUID valido" })
  @IsNotEmpty({ message: "O usuario nao pode estar vazio" })
  userId: string;
}
