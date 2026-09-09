import { Injectable } from "@nestjs/common";
import { type Prisma } from "generated/prisma/client";
import { PrismaService } from "../prisma.service";

@Injectable()
export class CategoriesRepository {
  constructor(private readonly prismaService: PrismaService) {}

  create(createDto: Prisma.CategoryCreateArgs) {
    return this.prismaService.category.create(createDto);
  }

  findMany(findManyDto: Prisma.CategoryFindManyArgs) {
    return this.prismaService.category.findMany(findManyDto);
  }

  findUnique(findUniqueDto: Prisma.CategoryFindUniqueArgs) {
    return this.prismaService.category.findUnique(findUniqueDto);
  }

  update(updateDto: Prisma.CategoryUpdateArgs) {
    return this.prismaService.category.update(updateDto);
  }

  delete(deleteDto: Prisma.CategoryDeleteArgs) {
    return this.prismaService.category.delete(deleteDto);
  }

  countListings(categoryId: string) {
    return this.prismaService.listing.count({
      where: { categoryId },
    });
  }
}
