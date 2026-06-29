import { ApiProperty } from "@nestjs/swagger";
import { ListingDetailsResponseDto } from "../../listings/dto/listing-response.dto";

export class RecommendationResponseDto {
  @ApiProperty({
    type: [ListingDetailsResponseDto],
    description: "Lista de anúncios ordenados por relevância e inteligência artificial",
  })
  listings: ListingDetailsResponseDto[];
}
