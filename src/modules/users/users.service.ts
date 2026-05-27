import { Injectable, NotFoundException } from "@nestjs/common";

import { UsersRepository } from "src/shared/database/repositories/users.repositories";

@Injectable()
export class UsersService {
  constructor(private readonly usersRepo: UsersRepository) {}

  async getUserById(userId: string) {
    const user = await this.usersRepo.findUnique({
      where: { id: userId },
      omit: { password: true },
    });

    if (!user) throw new NotFoundException("User not found");

    return { me: user };
  }
}
