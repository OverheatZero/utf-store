import { ApiProperty } from "@nestjs/swagger";

export class CategorySummaryResponseDto {
  @ApiProperty({ example: "d3b07384-d113-4ec2-a5d6-c0c21e7d8d29" })
  id: string;

  @ApiProperty({ example: "Livros" })
  name: string;

  @ApiProperty({ example: "livros" })
  slug: string;

  @ApiProperty({ example: "http://localhost:3000/uploads/icons/livros.png", nullable: true })
  iconUrl: string | null;

  @ApiProperty({ example: "Categoria destinada a livros universitários", nullable: true })
  description: string | null;

  @ApiProperty({ example: null, nullable: true })
  parentId: string | null;

  @ApiProperty({ example: "2026-06-28T18:49:08.000Z" })
  createdAt: Date;
}

export class CategoryDetailsResponseDto {
  @ApiProperty({ example: "d3b07384-d113-4ec2-a5d6-c0c21e7d8d29" })
  id: string;

  @ApiProperty({ example: "Livros" })
  name: string;

  @ApiProperty({ example: "livros" })
  slug: string;

  @ApiProperty({ example: "http://localhost:3000/uploads/icons/livros.png", nullable: true })
  iconUrl: string | null;

  @ApiProperty({ example: "Categoria destinada a livros universitários", nullable: true })
  description: string | null;

  @ApiProperty({ example: null, nullable: true })
  parentId: string | null;

  @ApiProperty({ example: "2026-06-28T18:49:08.000Z" })
  createdAt: Date;

  @ApiProperty({ type: CategorySummaryResponseDto, nullable: true })
  parent: CategorySummaryResponseDto | null;

  @ApiProperty({ type: [CategorySummaryResponseDto] })
  children: CategorySummaryResponseDto[];
}

export class CategoryResponseDto {
  @ApiProperty({ type: CategoryDetailsResponseDto })
  category: CategoryDetailsResponseDto;
}

export class CategoriesListResponseDto {
  @ApiProperty({ type: [CategoryDetailsResponseDto] })
  categories: CategoryDetailsResponseDto[];
}
