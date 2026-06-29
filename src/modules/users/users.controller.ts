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
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import type { Request } from "express";
import { UsersService } from "./users.service";
import { ActiveUserId } from "src/shared/decorators/ActiveUserId";
import { UpdateMeDto } from "./dto/update-me.dto";
import { MeResponseDto } from "./dto/user-response.dto";
import {
  buildUploadedFileUrl,
  createImageUploadOptions,
} from "src/shared/uploads/local-upload";
import type { LocalUploadedFile } from "src/shared/uploads/local-upload";

@ApiTags("Users")
@ApiBearerAuth()
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get("/me")
  @ApiOperation({ summary: "Obter dados do usuário autenticado" })
  @ApiResponse({
    status: 200,
    description: "Retorna as informações do perfil do usuário autenticado com sucesso.",
    type: MeResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: "Não autorizado. Token de autenticação ausente ou inválido.",
  })
  @ApiResponse({
    status: 404,
    description: "Usuário não encontrado.",
  })
  me(@ActiveUserId() userId: string) {
    return this.usersService.getUserById(userId);
  }

  @Patch("/me")
  @ApiOperation({ summary: "Atualizar dados do usuário autenticado" })
  @ApiResponse({
    status: 200,
    description: "Perfil do usuário atualizado com sucesso.",
    type: MeResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: "Dados fornecidos inválidos (validações falharam).",
  })
  @ApiResponse({
    status: 401,
    description: "Não autorizado. Token de autenticação ausente ou inválido.",
  })
  @ApiResponse({
    status: 409,
    description: "Conflito. O email informado já está sendo utilizado.",
  })
  updateMe(@ActiveUserId() userId: string, @Body() updateMeDto: UpdateMeDto) {
    return this.usersService.updateUser(userId, updateMeDto);
  }

  @Post("/me/avatar")
  @UseInterceptors(
    FileInterceptor("image", createImageUploadOptions("profiles")),
  )
  @ApiOperation({ summary: "Atualizar imagem de perfil (avatar) do usuário autenticado" })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        image: {
          type: "string",
          format: "binary",
          description: "Arquivo de imagem (formatos suportados: png, jpg, jpeg)",
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: "Imagem de perfil atualizada com sucesso.",
    type: MeResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: "Arquivo inválido ou campo ausente.",
  })
  @ApiResponse({
    status: 401,
    description: "Não autorizado. Token de autenticação ausente ou inválido.",
  })
  updateAvatar(
    @ActiveUserId() userId: string,
    @UploadedFile() file: LocalUploadedFile,
    @Req() request: Request,
  ) {
    const avatarUrl = buildUploadedFileUrl(request, "profiles", file);

    return this.usersService.updateUser(userId, { avatarUrl });
  }
}
