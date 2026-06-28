import { Controller, Get, Query } from "@nestjs/common";
import { ActiveUserId } from "src/shared/decorators/ActiveUserId";
import { RecommendationListingsQueryDto } from "./dto/recommendation-listings-query.dto";
import { RecommendationsService } from "./recommendations.service";

@Controller("recommendations")
export class RecommendationsController {
  constructor(
    private readonly recommendationsService: RecommendationsService,
  ) {}

  @Get("listings")
  findListings(
    @ActiveUserId() userId: string,
    @Query() query: RecommendationListingsQueryDto,
  ) {
    return this.recommendationsService.findListings(userId, query);
  }
}
