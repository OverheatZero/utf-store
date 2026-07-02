import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import type { Request } from "express";
import { UsersService } from "./users.service";
import { ActiveUserId } from "src/shared/decorators/ActiveUserId";
import { UpdateMeDto } from "./dto/update-me.dto";
import {
  buildUploadedFileUrl,
  createImageUploadOptions,
} from "src/shared/uploads/local-upload";
import type { LocalUploadedFile } from "src/shared/uploads/local-upload";
import { AdminGuard } from "src/shared/guards";
import { IsAdmin } from "src/shared/decorators";

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

  @Post("/me/avatar")
  @UseInterceptors(
    FileInterceptor("image", createImageUploadOptions("profiles")),
  )
  updateAvatar(
    @ActiveUserId() userId: string,
    @UploadedFile() file: LocalUploadedFile,
    @Req() request: Request,
  ) {
    const avatarUrl = buildUploadedFileUrl(request, "profiles", file);

    return this.usersService.updateUser(userId, { avatarUrl });
  }

  @Get()
  @UseGuards(AdminGuard)
  @IsAdmin()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  findAll(@ActiveUserId() _: string) {
    return this.usersService.findAll();
  }

  @Delete("/:id")
  @UseGuards(AdminGuard)
  @IsAdmin()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  delete(@ActiveUserId() userId: string, @Param("id") id: string) {
    return this.usersService.delete(userId, id);
  }
}
