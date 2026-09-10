import { Controller, Get, Query } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { ActiveUserId } from "src/shared/decorators/ActiveUserId";
import { RecommendationListingsQueryDto } from "./dto/recommendation-listings-query.dto";
import { RecommendationResponseDto } from "./dto/recommendation-response.dto";
import { RecommendationsService } from "./recommendations.service";

@ApiTags("Recommendations")
@ApiBearerAuth()
@Controller("recommendations")
export class RecommendationsController {
  constructor(
    private readonly recommendationsService: RecommendationsService,
  ) {}

  @Get("listings")
  @ApiOperation({
    summary:
      "Listar anúncios ordenados por IA de acordo com os interesses ou busca do usuário",
  })
  @ApiResponse({
    status: 200,
    description:
      "Retorna a lista de anúncios ordenados por relevância e IA com base no perfil do usuário ou prompt de pesquisa.",
    type: RecommendationResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: "Não autorizado. Token de autenticação ausente ou inválido.",
  })
  findListings(
    @ActiveUserId() userId: string,
    @Query() query: RecommendationListingsQueryDto,
  ) {
    return this.recommendationsService.findListings(userId, query);
  }
}
