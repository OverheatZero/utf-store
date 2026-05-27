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
}

export const env: Env = plainToInstance(Env, {
  dbURL: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
  corsOrigin: process.env.CORS_ORIGIN,
});

const errors = validateSync(env);

if (errors.length > 0) {
  throw new Error(JSON.stringify(errors, null, 2));
}
