import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { BadRequestException, Logger, ValidationPipe } from "@nestjs/common";
import type { ValidationError } from "class-validator";
import { getCorsOrigin } from "./shared/config/env";
import { join } from "node:path";
import express from "express";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
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
    allowedHeaders: ["Content-Type", "Authorization"],
    maxAge: 10,
  });

  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
