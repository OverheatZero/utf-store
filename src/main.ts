import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { getCorsOrigin } from "./shared/config/env";
import { join } from "node:path";
import express from "express";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());
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
