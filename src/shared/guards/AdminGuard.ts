import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import type { Request } from "express";
import { IS_ADMIN_KEY } from "src/shared/decorators/IsAdmin";
import { UsersRepository } from "src/shared/database/repositories/users.repositories";

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private usersRepository: UsersRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isAdminRequired = this.reflector.getAllAndOverride<boolean>(
      IS_ADMIN_KEY,
      [context.getClass(), context.getHandler()],
    );

    if (!isAdminRequired) return true;

    const request = context.switchToHttp().getRequest<Request>();
    const userId = request.userId;

    if (!userId) throw new ForbiddenException("User ID not found");

    const user = await this.usersRepository.findUnique({
      where: { id: userId },
    });

    if (!user || user.role !== "admin")
      throw new ForbiddenException(
        "Only administrators can access this resource",
      );

    return true;
  }
}
