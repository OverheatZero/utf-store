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
import { IsPublic } from "src/shared/decorators/IsPublic";
import { CategoriesService } from "./categories.service";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";

@Controller("categories")
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  @IsPublic()
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get(":id")
  @IsPublic()
  findOne(@Param("id", ParseUUIDPipe) categoryId: string) {
    return this.categoriesService.findOne(categoryId);
  }

  @Patch(":id")
  update(
    @Param("id", ParseUUIDPipe) categoryId: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(categoryId, updateCategoryDto);
  }

  @Delete(":id")
  remove(@Param("id", ParseUUIDPipe) categoryId: string) {
    return this.categoriesService.remove(categoryId);
  }
}
