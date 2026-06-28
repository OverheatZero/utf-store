import { Global, Module } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import { UsersRepository } from "./repositories/users.repositories";
import { ListingsRepository } from "./repositories/listings.repositories";
import { CategoriesRepository } from "./repositories/categories.repositories";
import { ChatRepository } from "./repositories/chat.repositories";

// NOTE: Provider`s por padrão são privados, preciso informar no `exports` o que está sendo exportado para outros módulos poderem utilizar.

// NOTE: @Global() fica automaticamente visivel para todos os módulos da aplicação.
@Global()
@Module({
  providers: [
    PrismaService,
    UsersRepository,
    ListingsRepository,
    CategoriesRepository,
    ChatRepository,
  ],
  exports: [
    UsersRepository,
    ListingsRepository,
    CategoriesRepository,
    ChatRepository,
  ],
})
export class DatabaseModule {}
