import { ApiProperty } from "@nestjs/swagger";
import { UserResponseDto } from "../../users/dto/user-response.dto";

export class CategoryResponseDto {
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

export class ListingImageResponseDto {
  @ApiProperty({ example: "d3b07384-d113-4ec2-a5d6-c0c21e7d8d29" })
  id: string;

  @ApiProperty({ example: "b21a8c3d-7485-4ae0-a292-02e0df2f3922" })
  listingId: string;

  @ApiProperty({ example: "http://localhost:3000/uploads/listings/imagem.jpg" })
  url: string;

  @ApiProperty({ example: 0, nullable: true })
  position: number | null;

  @ApiProperty({ example: true })
  isCover: boolean;

  @ApiProperty({ example: "2026-06-28T18:49:08.000Z" })
  createdAt: Date;
}

export class ListingDetailsResponseDto {
  @ApiProperty({ example: "b21a8c3d-7485-4ae0-a292-02e0df2f3922", description: "ID único do anúncio (UUID)" })
  id: string;

  @ApiProperty({ example: "d3b07384-d113-4ec2-a5d6-c0c21e7d8d29", description: "ID do vendedor" })
  sellerId: string;

  @ApiProperty({ example: "d3b07384-d113-4ec2-a5d6-c0c21e7d8d29", description: "ID da categoria" })
  categoryId: string;

  @ApiProperty({ example: "Livro de Cálculo 1 - Guidorizzi", description: "Título do anúncio" })
  title: string;

  @ApiProperty({ example: "Livro em perfeito estado, edição recente.", nullable: true, description: "Descrição do anúncio" })
  description: string | null;

  @ApiProperty({ example: "59.90", description: "Preço do item" })
  price: string;

  @ApiProperty({ example: "NEW", description: "Condição do item (e.g. NEW, USED)" })
  condition: string;

  @ApiProperty({ example: "SELL", description: "Tipo de anúncio (e.g. SELL, DONATE)" })
  type: string;

  @ApiProperty({ example: "ACTIVE", description: "Status do anúncio (e.g. ACTIVE, SOLD)" })
  status: string;

  @ApiProperty({ example: "Campus Curitiba", nullable: true, description: "Localização de entrega do item" })
  location: string | null;

  @ApiProperty({ example: 42, description: "Quantidade de visualizações do anúncio" })
  viewsCount: number;

  @ApiProperty({ example: "2026-06-28T18:49:08.000Z", description: "Data de criação" })
  createdAt: Date;

  @ApiProperty({ example: "2026-06-28T18:49:08.000Z", description: "Data da última atualização" })
  updatedAt: Date;

  @ApiProperty({ type: UserResponseDto, description: "Dados do vendedor" })
  seller: UserResponseDto;

  @ApiProperty({ type: CategoryResponseDto, description: "Dados da categoria do anúncio" })
  category: CategoryResponseDto;

  @ApiProperty({ type: [ListingImageResponseDto], description: "Lista de imagens vinculadas ao anúncio" })
  images: ListingImageResponseDto[];
}

export class ListingResponseDto {
  @ApiProperty({ type: ListingDetailsResponseDto })
  listing: ListingDetailsResponseDto;
}

export class ListingsListResponseDto {
  @ApiProperty({ type: [ListingDetailsResponseDto] })
  listings: ListingDetailsResponseDto[];
}

export class ListingImageUploadResponseDto {
  @ApiProperty({ type: ListingImageResponseDto })
  image: ListingImageResponseDto;
}
