import { IsOptional, IsString, IsUUID } from "class-validator";

export class FindListingsQueryDto {
  @IsUUID("4", { message: "A categoria precisa ser um UUID valido" })
  @IsOptional()
  categoryId?: string;

  @IsUUID("4", { message: "O vendedor precisa ser um UUID valido" })
  @IsOptional()
  sellerId?: string;

  @IsString({ message: "O status precisa ser uma string" })
  @IsOptional()
  status?: string;

  @IsString({ message: "O tipo precisa ser uma string" })
  @IsOptional()
  type?: string;

  @IsString({ message: "A condicao precisa ser uma string" })
  @IsOptional()
  condition?: string;

  @IsString({ message: "A busca precisa ser uma string" })
  @IsOptional()
  search?: string;
}
