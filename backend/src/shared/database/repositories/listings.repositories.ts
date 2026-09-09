import { Injectable } from "@nestjs/common";
import { type Prisma } from "generated/prisma/client";
import { PrismaService } from "../prisma.service";

@Injectable()
export class ListingsRepository {
  constructor(private readonly prismaService: PrismaService) {}

  create(createDto: Prisma.ListingCreateArgs) {
    return this.prismaService.listing.create(createDto);
  }

  findMany(findManyDto: Prisma.ListingFindManyArgs) {
    return this.prismaService.listing.findMany(findManyDto);
  }

  findUnique(findUniqueDto: Prisma.ListingFindUniqueArgs) {
    return this.prismaService.listing.findUnique(findUniqueDto);
  }

  update(updateDto: Prisma.ListingUpdateArgs) {
    return this.prismaService.listing.update(updateDto);
  }

  delete(deleteDto: Prisma.ListingDeleteArgs) {
    return this.prismaService.listing.delete(deleteDto);
  }

  createImage(createDto: Prisma.ListingImageCreateArgs) {
    return this.prismaService.listingImage.create(createDto);
  }

  countImages(where: Prisma.ListingImageWhereInput) {
    return this.prismaService.listingImage.count({ where });
  }

  updateImages(updateDto: Prisma.ListingImageUpdateManyArgs) {
    return this.prismaService.listingImage.updateMany(updateDto);
  }

  findCategoryById(categoryId: string) {
    return this.prismaService.category.findUnique({
      where: { id: categoryId },
      select: { id: true },
    });
  }
}
