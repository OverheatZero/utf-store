import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
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
  @ApiProperty({
    description: "Nome da categoria",
    example: "Livros",
    maxLength: 80,
  })
  @IsString({ message: "O nome precisa ser uma string" })
  @IsNotEmpty({ message: "O nome nao pode estar vazio" })
  @MaxLength(80, { message: "O nome deve ter no maximo 80 caracteres" })
  name: string;

  @ApiProperty({
    description: "Slug único identificador da categoria (apenas letras minúsculas, números e hifens)",
    example: "livros",
    maxLength: 100,
  })
  @IsString({ message: "O slug precisa ser uma string" })
  @IsNotEmpty({ message: "O slug nao pode estar vazio" })
  @MaxLength(100, { message: "O slug deve ter no maximo 100 caracteres" })
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: "O slug precisa conter apenas letras minusculas, numeros e hifens",
  })
  slug: string;

  @ApiPropertyOptional({
    description: "URL do ícone ou imagem representativa da categoria",
    example: "http://localhost:3000/uploads/icons/livros.png",
  })
  @IsUrl({}, { message: "O icone precisa ser uma URL valida" })
  @IsOptional()
  iconUrl?: string;

  @ApiPropertyOptional({
    description: "Descrição da categoria (máximo 255 caracteres)",
    example: "Categoria destinada a livros universitários, apostilas e materiais de estudo.",
    maxLength: 255,
  })
  @IsString({ message: "A descricao precisa ser uma string" })
  @MaxLength(255, { message: "A descricao deve ter no maximo 255 caracteres" })
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: "ID da categoria pai (UUID v4), caso seja uma subcategoria",
    example: "d3b07384-d113-4ec2-a5d6-c0c21e7d8d29",
  })
  @IsUUID("4", { message: "A categoria pai precisa ser um UUID valido" })
  @IsOptional()
  parentId?: string;
}
