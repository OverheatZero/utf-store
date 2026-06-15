import { IsNotEmpty, IsUUID } from "class-validator";

export class FindMessagesQueryDto {
  @IsUUID("4", { message: "O anuncio precisa ser um UUID valido" })
  @IsNotEmpty({ message: "O anuncio nao pode estar vazio" })
  listingId: string;

  @IsUUID("4", { message: "O usuario precisa ser um UUID valido" })
  @IsNotEmpty({ message: "O usuario nao pode estar vazio" })
  userId: string;
}
