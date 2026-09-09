import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsDecimal,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from "class-validator";

export class CreateListingDto {
  @ApiProperty({
    description: "ID da categoria do anúncio (UUID v4)",
    example: "d3b07384-d113-4ec2-a5d6-c0c21e7d8d29",
  })
  @IsUUID("4", { message: "A categoria precisa ser um UUID valido" })
  @IsNotEmpty({ message: "A categoria nao pode estar vazia" })
  categoryId: string;

  @ApiProperty({
    description: "Título do anúncio",
    example: "Livro de Redes ",
  })
  @IsString({ message: "O titulo precisa ser uma string" })
  @IsNotEmpty({ message: "O titulo nao pode estar vazio" })
  title: string;

  @ApiPropertyOptional({
    description: "Descrição detalhada do item anunciado",
    example: "Livro em excelente estado de conservação, sem marcações ou rasuras.",
  })
  @IsString({ message: "A descricao precisa ser uma string" })
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: "Preço do item (com até duas casas decimais)",
    example: "59.90",
  })
  @IsDecimal(
    { decimal_digits: "0,2" },
    { message: "O preco precisa ser um decimal valido" },
  )
  @IsNotEmpty({ message: "O preco nao pode estar vazio" })
  price: string;

  @ApiProperty({
    description: "Condição física do item anunciado",
    example: "USED",
    enum: ["NEW", "USED"],
  })
  @IsString({ message: "A condicao precisa ser uma string" })
  @IsNotEmpty({ message: "A condicao nao pode estar vazia" })
  condition: string;

  @ApiProperty({
    description: "Tipo do anúncio",
    example: "SELL",
    enum: ["SELL", "DONATE"],
  })
  @IsString({ message: "O tipo precisa ser uma string" })
  @IsNotEmpty({ message: "O tipo nao pode estar vazio" })
  type: string;

  @ApiPropertyOptional({
    description: "Status do anúncio",
    example: "ACTIVE",
    default: "ACTIVE",
  })
  @IsString({ message: "O status precisa ser uma string" })
  @IsOptional()
  status?: string;

  @ApiPropertyOptional({
    description: "Localização sugerida para a entrega/retirada",
    example: "Campus Curitiba (Sede Centro)",
  })
  @IsString({ message: "A localizacao precisa ser uma string" })
  @IsOptional()
  location?: string;
}
