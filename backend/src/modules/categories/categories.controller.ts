import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { IsPublic } from "src/shared/decorators/IsPublic";
import { CategoriesService } from "./categories.service";
import { CreateCategoryDto } from "./dto/create-category.dto";
import {
  CategoriesListResponseDto,
  CategoryResponseDto,
} from "./dto/category-response.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";

@ApiTags("Categories")
@Controller("categories")
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: "Criar uma nova categoria" })
  @ApiResponse({
    status: 201,
    description: "Categoria criada com sucesso.",
    type: CategoryResponseDto,
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
    status: 409,
    description: "Conflito. O slug da categoria já existe.",
  })
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  @IsPublic()
  @ApiOperation({ summary: "Buscar todas as categorias existentes" })
  @ApiResponse({
    status: 200,
    description: "Lista de categorias retornada com sucesso.",
    type: CategoriesListResponseDto,
  })
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get(":id")
  @IsPublic()
  @ApiOperation({ summary: "Buscar os detalhes de uma categoria específica por ID" })
  @ApiResponse({
    status: 200,
    description: "Detalhes da categoria retornados com sucesso.",
    type: CategoryResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: "Categoria não encontrada.",
  })
  findOne(@Param("id", ParseUUIDPipe) categoryId: string) {
    return this.categoriesService.findOne(categoryId);
  }

  @Patch(":id")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Atualizar uma categoria existente" })
  @ApiResponse({
    status: 200,
    description: "Categoria atualizada com sucesso.",
    type: CategoryResponseDto,
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
    status: 409,
    description: "Conflito. O slug informado já está sendo utilizado.",
  })
  update(
    @Param("id", ParseUUIDPipe) categoryId: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(categoryId, updateCategoryDto);
  }

  @Delete(":id")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Remover uma categoria existente" })
  @ApiResponse({
    status: 204,
    description: "Categoria removida com sucesso.",
  })
  @ApiResponse({
    status: 401,
    description: "Não autorizado. Token de autenticação ausente ou inválido.",
  })
  @ApiResponse({
    status: 404,
    description: "Categoria não encontrada.",
  })
  remove(@Param("id", ParseUUIDPipe) categoryId: string) {
    return this.categoriesService.remove(categoryId);
  }
}
