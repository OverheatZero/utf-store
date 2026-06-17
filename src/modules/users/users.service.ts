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
      where: { id: userId },
      omit: { password: true },
    });

    if (!user) throw new NotFoundException("User not found");

    return { me: user };
  }

  async updateUser(userId: string, updateMeDto: UpdateMeDto) {
    await this.getUserById(userId);

    if (updateMeDto.email) {
      const emailOwner = await this.usersRepo.findUnique({
        where: { email: updateMeDto.email },
        select: { id: true },
      });

      if (emailOwner && emailOwner.id !== userId) {
        throw new ConflictException("This email is a already in use");
      }
    }

    const user = await this.usersRepo.update({
      where: { id: userId },
      data: {
        name: updateMeDto.name,
        email: updateMeDto.email,
        course: updateMeDto.course,
        campus: updateMeDto.campus,
        avatarUrl: updateMeDto.avatarUrl,
        bio: updateMeDto.bio,
      },
      omit: { password: true },
    });

    return { me: user };
  }
}
