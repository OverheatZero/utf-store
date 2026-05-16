import { Global, Module } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import { UsersRepository } from "./repositories/users.repositories";

// NOTE: Provider`s por padrão são privados, preciso informar no `exports` o que está sendo exportado para outros módulos poderem utilizar.

// NOTE: @Global() fica automaticamente visivel para todos os módulos da aplicação.
@Global()
@Module({
  providers: [PrismaService, UsersRepository],
  exports: [UsersRepository],
})
export class DatabaseModule {}
