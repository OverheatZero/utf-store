import {
  ExecutionContext,
  UnauthorizedException,
  createParamDecorator,
} from "@nestjs/common";
import type { Request } from "express";

export const ActiveUserId = createParamDecorator<undefined>(
  (_, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<Request>();
    const userId = request.userId;

    if (!userId) throw new UnauthorizedException();

    return userId;
  },
);
