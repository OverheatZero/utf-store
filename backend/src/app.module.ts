import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";

import { DatabaseModule } from "./shared/database/database.module";
import { UsersModule } from "./modules/users/users.module";
import { AuthModule } from "./modules/auth/auth.module";
import { AuthGuard } from "./modules/auth/auth.guard";
import { ListingsModule } from "./modules/listings/listings.module";
import { CategoriesModule } from "./modules/categories/categories.module";
import { ChatModule } from "./modules/chat/chat.module";
import { RecommendationsModule } from "./modules/recommendations/recommendations.module";
import { HealthController } from "./health.controller";

@Module({
  imports: [
    UsersModule,
    DatabaseModule,
    AuthModule,
    ListingsModule,
    CategoriesModule,
    ChatModule,
    RecommendationsModule,
  ],
  controllers: [HealthController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
