import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import { UsersRepository } from "src/shared/database/repositories/users.repositories";
import { UpdateMeDto } from "./dto/update-me.dto";

@Injectable()
export class UsersService {
  constructor(private readonly usersRepo: UsersRepository) {}

  async getUserById(userId: string) {
    const user = await this.usersRepo.findUnique({
      where: { id: userId, deletedAt: null },
      omit: { password: true },
    });

    if (!user) throw new NotFoundException("User not found");

    return { me: user };
  }

  async updateUser(userId: string, updateMeDto: UpdateMeDto) {
    await this.getUserById(userId);

    if (updateMeDto.email) {
      const emailOwner = await this.usersRepo.findUnique({
        where: { email: updateMeDto.email, deletedAt: null },
        select: { id: true },
      });

      if (emailOwner && emailOwner.id !== userId) {
        throw new ConflictException("This email is a already in use");
      }
    }

    const user = await this.usersRepo.update({
      where: { id: userId, deletedAt: null },
      data: {
        name: updateMeDto.name,
        email: updateMeDto.email,
        course: updateMeDto.course,
        campus: updateMeDto.campus,
        avatarUrl: updateMeDto.avatarUrl,
        bio: updateMeDto.bio,
        defaultUserPrompt: updateMeDto.defaultUserPrompt,
      },
      omit: { password: true },
    });

    return { me: user };
  }

  async findAll() {
    const users = await this.usersRepo.findMany({
      where: { deletedAt: null },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        course: true,
        campus: true,
        avatarUrl: true,
        bio: true,
        defaultUserPrompt: true,
        createdAt: true,
        isVerified: true,
      },
    });

    return { data: users };
  }

  async delete(userId: string, id: string) {
    if (userId === id)
      throw new ConflictException("You cannot delete yourself");

    await this.getUserById(id);

    return this.usersRepo.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
