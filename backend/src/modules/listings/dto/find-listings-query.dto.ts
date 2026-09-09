import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, IsUUID } from "class-validator";

export class FindListingsQueryDto {
  @ApiPropertyOptional({
    description: "Filtrar anúncios por ID de categoria (UUID v4)",
    example: "d3b07384-d113-4ec2-a5d6-c0c21e7d8d29",
  })
  @IsUUID("4", { message: "A categoria precisa ser um UUID valido" })
  @IsOptional()
  categoryId?: string;

  @ApiPropertyOptional({
    description: "Filtrar anúncios por ID do vendedor (UUID v4)",
    example: "b21a8c3d-7485-4ae0-a292-02e0df2f3922",
  })
  @IsUUID("4", { message: "O vendedor precisa ser um UUID valido" })
  @IsOptional()
  sellerId?: string;

  @ApiPropertyOptional({
    description: "Filtrar por status do anúncio (e.g. ACTIVE, SOLD)",
    example: "ACTIVE",
  })
  @IsString({ message: "O status precisa ser uma string" })
  @IsOptional()
  status?: string;

  @ApiPropertyOptional({
    description: "Filtrar por tipo do anúncio",
    example: "SELL",
    enum: ["SELL", "DONATE"],
  })
  @IsString({ message: "O tipo precisa ser uma string" })
  @IsOptional()
  type?: string;

  @ApiPropertyOptional({
    description: "Filtrar por condição física do item",
    example: "USED",
    enum: ["NEW", "USED"],
  })
  @IsString({ message: "A condicao precisa ser uma string" })
  @IsOptional()
  condition?: string;

  @ApiPropertyOptional({
    description: "Termo de busca textual para encontrar anúncios pelo título ou descrição",
    example: "calculo",
  })
  @IsString({ message: "A busca precisa ser uma string" })
  @IsOptional()
  search?: string;
}
