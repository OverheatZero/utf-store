import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
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
import { ActiveUserId } from "src/shared/decorators/ActiveUserId";
import { IsPublic } from "src/shared/decorators/IsPublic";
import {
  buildUploadedFileUrl,
  createImageUploadOptions,
} from "src/shared/uploads/local-upload";
import type { LocalUploadedFile } from "src/shared/uploads/local-upload";
import { CreateListingDto } from "./dto/create-listing.dto";
import { FindListingsQueryDto } from "./dto/find-listings-query.dto";
import { UpdateListingDto } from "./dto/update-listing.dto";
import {
  ListingImageUploadResponseDto,
  ListingResponseDto,
  ListingsListResponseDto,
} from "./dto/listing-response.dto";
import { ListingsService } from "./listings.service";
import { AdminGuard } from "src/shared/guards";
import { IsAdmin } from "src/shared/decorators";

@ApiTags("Listings")
@Controller("listings")
export class ListingsController {
  constructor(private readonly listingsService: ListingsService) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: "Criar um novo anúncio" })
  @ApiResponse({
    status: 201,
    description: "Anúncio criado com sucesso.",
    type: ListingResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: "Dados fornecidos inválidos.",
  })
  @ApiResponse({
    status: 401,
    description: "Não autorizado. Token de autenticação ausente ou inválido.",
  })
  @ApiResponse({
    status: 404,
    description: "Categoria não encontrada.",
  })
  create(
    @ActiveUserId() userId: string,
    @Body() createListingDto: CreateListingDto,
  ) {
    return this.listingsService.create(userId, createListingDto);
  }

  @Get()
  @IsPublic()
  @ApiOperation({
    summary: "Buscar todos os anúncios ativos com filtros opcionais",
  })
  @ApiResponse({
    status: 200,
    description: "Lista de anúncios ativos retornada com sucesso.",
    type: ListingsListResponseDto,
  })
  findAll(@Query() query: FindListingsQueryDto) {
    return this.listingsService.findAll(query);
  }

  @Get("/admin")
  @UseGuards(AdminGuard)
  @IsAdmin()
  findAllForAdmin(
    @ActiveUserId() _: string,
    @Query() query: FindListingsQueryDto,
  ) {
    return this.listingsService.findAll(query, {
      seller: { deletedAt: null },
    });
  }

  @Get(":id")
  @IsPublic()
  @ApiOperation({ summary: "Buscar os detalhes de um anúncio específico" })
  @ApiResponse({
    status: 200,
    description: "Detalhes do anúncio retornados com sucesso.",
    type: ListingResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: "Anúncio não encontrado.",
  })
  findOne(@Param("id", ParseUUIDPipe) listingId: string) {
    return this.listingsService.findOne(listingId);
  }

  @Patch(":id")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Atualizar os dados de um anúncio existente" })
  @ApiResponse({
    status: 200,
    description: "Anúncio atualizado com sucesso.",
    type: ListingResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: "Dados fornecidos inválidos.",
  })
  @ApiResponse({
    status: 401,
    description: "Não autorizado. Token de autenticação ausente ou inválido.",
  })
  @ApiResponse({
    status: 403,
    description:
      "Proibido. O usuário autenticado não é o proprietário do anúncio.",
  })
  @ApiResponse({
    status: 404,
    description: "Anúncio ou categoria não encontrado.",
  })
  update(
    @ActiveUserId() userId: string,
    @Param("id", ParseUUIDPipe) listingId: string,
    @Body() updateListingDto: UpdateListingDto,
  ) {
    return this.listingsService.update(userId, listingId, updateListingDto);
  }

  @Delete(":id")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Remover um anúncio existente" })
  @ApiResponse({
    status: 204,
    description: "Anúncio removido com sucesso.",
  })
  @ApiResponse({
    status: 401,
    description: "Não autorizado. Token de autenticação ausente ou inválido.",
  })
  @ApiResponse({
    status: 403,
    description:
      "Proibido. O usuário autenticado não é o proprietário do anúncio.",
  })
  @ApiResponse({
    status: 404,
    description: "Anúncio não encontrado.",
  })
  remove(
    @ActiveUserId() userId: string,
    @Param("id", ParseUUIDPipe) listingId: string,
  ) {
    return this.listingsService.remove(userId, listingId);
  }

  @Post(":id/images")
  @ApiBearerAuth()
  @UseInterceptors(
    FileInterceptor("image", createImageUploadOptions("listings")),
  )
  @ApiOperation({ summary: "Adicionar uma nova imagem a um anúncio existente" })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        image: {
          type: "string",
          format: "binary",
          description:
            "Arquivo de imagem (formatos suportados: png, jpg, jpeg)",
        },
        isCover: {
          type: "string",
          description:
            "Define se esta imagem deve ser a capa do anúncio ('true' ou 'false')",
          example: "true",
        },
        position: {
          type: "string",
          description: "Posição de ordenação da imagem (e.g. '0', '1')",
          example: "0",
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: "Imagem adicionada com sucesso.",
    type: ListingImageUploadResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: "Arquivo ou dados fornecidos inválidos.",
  })
  @ApiResponse({
    status: 401,
    description: "Não autorizado. Token de autenticação ausente ou inválido.",
  })
  @ApiResponse({
    status: 403,
    description:
      "Proibido. O usuário autenticado não é o proprietário do anúncio.",
  })
  @ApiResponse({
    status: 404,
    description: "Anúncio não encontrado.",
  })
  addImage(
    @ActiveUserId() userId: string,
    @Param("id", ParseUUIDPipe) listingId: string,
    @UploadedFile() file: LocalUploadedFile,
    @Req() request: Request,
    @Body("isCover") isCover?: string,
    @Body("position") position?: string,
  ) {
    const url = buildUploadedFileUrl(request, "listings", file);

    return this.listingsService.addImage(
      userId,
      listingId,
      file,
      url,
      isCover,
      position,
    );
  }
}
