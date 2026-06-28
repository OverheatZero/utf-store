import { IsOptional, IsString, MaxLength } from "class-validator";

export class RecommendationListingsQueryDto {
  @IsString({ message: "O prompt precisa ser uma string" })
  @IsOptional()
  @MaxLength(500, {
    message: "O prompt pode ter no maximo 500 caracteres",
  })
  prompt?: string;
}
