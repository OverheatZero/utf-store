import "dotenv/config";
import { plainToInstance } from "class-transformer";
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  validateSync,
} from "class-validator";

class Env {
  @IsString()
  @IsNotEmpty()
  dbURL: string;

  @IsString()
  @IsNotEmpty()
  jwtSecret: string;

  @IsString()
  @IsOptional()
  corsOrigin?: string;

  @IsString()
  @IsOptional()
  openRouterApiKey?: string;

  @IsString()
  @IsOptional()
  openRouterModel?: string;

  @IsString()
  @IsOptional()
  recommendationsSystemPrompt?: string;
}

export const env: Env = plainToInstance(Env, {
  dbURL: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
  corsOrigin: process.env.CORS_ORIGIN,
  openRouterApiKey: process.env.OPENROUTER_API_KEY,
  openRouterModel: process.env.OPENROUTER_MODEL,
  recommendationsSystemPrompt: process.env.RECOMMENDATIONS_SYSTEM_PROMPT,
});

export const getCorsOrigin = (): string | string[] | boolean => {
  const origins = env.corsOrigin
    ?.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  if (!origins?.length) return true;
  return origins.length === 1 ? origins[0] : origins;
};

const errors = validateSync(env);

if (errors.length > 0) {
  throw new Error(JSON.stringify(errors, null, 2));
}
