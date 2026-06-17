import { Body, Controller, Get, Patch } from "@nestjs/common";
import { UsersService } from "./users.service";
import { ActiveUserId } from "src/shared/decorators/ActiveUserId";
import { UpdateMeDto } from "./dto/update-me.dto";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get("/me")
  me(@ActiveUserId() userId: string) {
    return this.usersService.getUserById(userId);
  }

  @Patch("/me")
  updateMe(@ActiveUserId() userId: string, @Body() updateMeDto: UpdateMeDto) {
    return this.usersService.updateUser(userId, updateMeDto);
  }
}
