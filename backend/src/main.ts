import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { BadRequestException, Logger, ValidationPipe } from "@nestjs/common";
import type { ValidationError } from "class-validator";
import { getCorsOrigin } from "./shared/config/env";
import { join } from "node:path";
import express from "express";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import type { NestExpressApplication } from "@nestjs/platform-express";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Em produção o Nest fica atrás do Caddy; sem isso o Express reporta
  // protocol "http" e as URLs de upload saem com http:// numa página https.
  app.set("trust proxy", 1);

  const logger = new Logger("ValidationPipe");

  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors: ValidationError[]) => {
        const formattedErrors = errors.map((error) => ({
          property: error.property,
          constraints: error.constraints,
          value: error.value,
        }));

        logger.warn(`Erro de validacao: ${JSON.stringify(formattedErrors)}`);

        return new BadRequestException(
          errors.flatMap((error) => Object.values(error.constraints || {})),
        );
      },
    }),
  );

  app.use("/uploads", express.static(join(process.cwd(), "uploads")));

  app.enableCors({
    origin: getCorsOrigin(),
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "ambient"],
    maxAge: 10,
  });

  // Swagger
  const config = new DocumentBuilder()
    .setTitle("UTF Store - API")
    .setDescription("Documentação da API")
    .setVersion("1.0")
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup("docs", app, document);

  // Caddy escuta em $PORT e faz proxy para o Nest em $NEST_PORT; fora do
  // container os dois caem no comportamento antigo ($PORT, todas as interfaces).
  await app.listen(
    process.env.NEST_PORT ?? process.env.PORT ?? 3000,
    process.env.HOST ?? "0.0.0.0",
  );
}

void bootstrap();
