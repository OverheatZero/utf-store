import {
  IsDecimal,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from "class-validator";

export class CreateListingDto {
  @IsUUID("4", { message: "A categoria precisa ser um UUID valido" })
  @IsNotEmpty({ message: "A categoria nao pode estar vazia" })
  categoryId: string;

  @IsString({ message: "O titulo precisa ser uma string" })
  @IsNotEmpty({ message: "O titulo nao pode estar vazio" })
  title: string;

  @IsString({ message: "A descricao precisa ser uma string" })
  @IsOptional()
  description?: string;

  @IsDecimal(
    { decimal_digits: "0,2" },
    { message: "O preco precisa ser um decimal valido" },
  )
  @IsNotEmpty({ message: "O preco nao pode estar vazio" })
  price: string;

  @IsString({ message: "A condicao precisa ser uma string" })
  @IsNotEmpty({ message: "A condicao nao pode estar vazia" })
  condition: string;

  @IsString({ message: "O tipo precisa ser uma string" })
  @IsNotEmpty({ message: "O tipo nao pode estar vazio" })
  type: string;

  @IsString({ message: "O status precisa ser uma string" })
  @IsOptional()
  status?: string;

  @IsString({ message: "A localizacao precisa ser uma string" })
  @IsOptional()
  location?: string;
}
