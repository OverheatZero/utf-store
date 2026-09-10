import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, MaxLength } from "class-validator";

export class RecommendationListingsQueryDto {
  @ApiPropertyOptional({
    description:
      "Prompt opcional para personalizar a busca/recomendação de anúncios de forma contextual (máximo 500 caracteres). Se omitido, usará o prompt padrão do usuário.",
    example: "livros de cálculo e física para engenharia",
    maxLength: 500,
  })
  @IsString({ message: "O prompt precisa ser uma string" })
  @IsOptional()
  @MaxLength(500, {
    message: "O prompt pode ter no maximo 500 caracteres",
  })
  prompt?: string;
}
