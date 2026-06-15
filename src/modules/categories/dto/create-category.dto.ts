import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  Matches,
  MaxLength,
} from "class-validator";

export class CreateCategoryDto {
  @IsString({ message: "O nome precisa ser uma string" })
  @IsNotEmpty({ message: "O nome nao pode estar vazio" })
  @MaxLength(80, { message: "O nome deve ter no maximo 80 caracteres" })
  name: string;

  @IsString({ message: "O slug precisa ser uma string" })
  @IsNotEmpty({ message: "O slug nao pode estar vazio" })
  @MaxLength(100, { message: "O slug deve ter no maximo 100 caracteres" })
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: "O slug precisa conter apenas letras minusculas, numeros e hifens",
  })
  slug: string;

  @IsUrl({}, { message: "O icone precisa ser uma URL valida" })
  @IsOptional()
  iconUrl?: string;

  @IsString({ message: "A descricao precisa ser uma string" })
  @MaxLength(255, { message: "A descricao deve ter no maximo 255 caracteres" })
  @IsOptional()
  description?: string;

  @IsUUID("4", { message: "A categoria pai precisa ser um UUID valido" })
  @IsOptional()
  parentId?: string;
}
