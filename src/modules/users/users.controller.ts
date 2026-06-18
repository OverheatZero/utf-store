import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Req,
  UploadedFile,
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
}
