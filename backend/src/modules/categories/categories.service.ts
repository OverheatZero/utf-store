import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { type Prisma } from "generated/prisma/client";
import { CategoriesRepository } from "../../shared/database/repositories/categories.repositories";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";

const categorySummarySelect = {
  id: true,
  name: true,
  slug: true,
  iconUrl: true,
  description: true,
  parentId: true,
  createdAt: true,
} satisfies Prisma.CategorySelect;

const categoryInclude = {
  parent: {
    select: categorySummarySelect,
  },
  children: {
    select: categorySummarySelect,
    orderBy: { name: "asc" },
  },
} satisfies Prisma.CategoryInclude;

@Injectable()
export class CategoriesService {
  constructor(private readonly categoriesRepo: CategoriesRepository) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const existingCategory = await this.categoriesRepo.findUnique({
      where: { slug: createCategoryDto.slug },
      select: { id: true },
    });

    if (existingCategory) {
      throw new ConflictException("Category slug already exists");
    }

    if (createCategoryDto.parentId) {
      await this.ensureParentExists(createCategoryDto.parentId);
    }

    const category = await this.categoriesRepo.create({
      data: {
        name: createCategoryDto.name,
        slug: createCategoryDto.slug,
        iconUrl: createCategoryDto.iconUrl,
        description: createCategoryDto.description,
        parentId: createCategoryDto.parentId,
      },
      include: categoryInclude,
    });

    return { category };
  }

  async findAll() {
    const categories = await this.categoriesRepo.findMany({
      include: categoryInclude,
      orderBy: { name: "asc" },
    });

    return { categories };
  }

  async findOne(categoryId: string) {
    const category = await this.categoriesRepo.findUnique({
      where: { id: categoryId },
      include: categoryInclude,
    });

    if (!category) throw new NotFoundException("Category not found");

    return { category };
  }

  async update(categoryId: string, updateCategoryDto: UpdateCategoryDto) {
    await this.findCategoryOrThrow(categoryId);

    if (updateCategoryDto.slug) {
      const existingCategory = await this.categoriesRepo.findUnique({
        where: { slug: updateCategoryDto.slug },
        select: { id: true },
      });

      if (existingCategory && existingCategory.id !== categoryId) {
        throw new ConflictException("Category slug already exists");
      }
    }

    if (updateCategoryDto.parentId) {
      if (updateCategoryDto.parentId === categoryId) {
        throw new BadRequestException("Category cannot be its own parent");
      }

      await this.ensureParentDoesNotCreateCycle(
        categoryId,
        updateCategoryDto.parentId,
      );
    }

    const category = await this.categoriesRepo.update({
      where: { id: categoryId },
      data: {
        name: updateCategoryDto.name,
        slug: updateCategoryDto.slug,
        iconUrl: updateCategoryDto.iconUrl,
        description: updateCategoryDto.description,
        parentId: updateCategoryDto.parentId,
      },
      include: categoryInclude,
    });

    return { category };
  }

  async remove(categoryId: string) {
    await this.findCategoryOrThrow(categoryId);

    const listingsCount = await this.categoriesRepo.countListings(categoryId);

    if (listingsCount > 0) {
      throw new BadRequestException("Category with listings cannot be deleted");
    }

    await this.categoriesRepo.delete({
      where: { id: categoryId },
    });
  }

  private async findCategoryOrThrow(categoryId: string) {
    const category = await this.categoriesRepo.findUnique({
      where: { id: categoryId },
      select: { id: true },
    });

    if (!category) throw new NotFoundException("Category not found");

    return category;
  }

  private async ensureParentExists(parentId: string) {
    const parent = await this.categoriesRepo.findUnique({
      where: { id: parentId },
      select: { id: true },
    });

    if (!parent) throw new NotFoundException("Parent category not found");

    return parent;
  }

  private async ensureParentDoesNotCreateCycle(
    categoryId: string,
    parentId: string,
  ) {
    let currentParentId: string | null = parentId;

    while (currentParentId) {
      const parent = await this.categoriesRepo.findUnique({
        where: { id: currentParentId },
        select: { id: true, parentId: true },
      });

      if (!parent) throw new NotFoundException("Parent category not found");

      if (parent.id === categoryId || parent.parentId === categoryId) {
        throw new BadRequestException(
          "Category parent would create a hierarchy cycle",
        );
      }

      currentParentId = parent.parentId;
    }
  }
}
