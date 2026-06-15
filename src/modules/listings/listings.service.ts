import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { type Prisma } from "generated/prisma/client";
import { ListingsRepository } from "src/shared/database/repositories/listings.repositories";
import { CreateListingDto } from "./dto/create-listing.dto";
import { FindListingsQueryDto } from "./dto/find-listings-query.dto";
import { UpdateListingDto } from "./dto/update-listing.dto";

const listingInclude = {
  seller: {
    select: {
      id: true,
      name: true,
      email: true,
      course: true,
      campus: true,
      avatarUrl: true,
      bio: true,
      isVerified: true,
      createdAt: true,
      updatedAt: true,
    },
  },
  category: true,
  images: {
    orderBy: [{ isCover: "desc" }, { position: "asc" }, { createdAt: "asc" }],
  },
} satisfies Prisma.ListingInclude;

@Injectable()
export class ListingsService {
  constructor(private readonly listingsRepo: ListingsRepository) {}

  async create(userId: string, createListingDto: CreateListingDto) {
    await this.ensureCategoryExists(createListingDto.categoryId);

    const listing = await this.listingsRepo.create({
      data: {
        sellerId: userId,
        categoryId: createListingDto.categoryId,
        title: createListingDto.title,
        description: createListingDto.description,
        price: createListingDto.price,
        condition: createListingDto.condition,
        type: createListingDto.type,
        status: createListingDto.status,
        location: createListingDto.location,
      },
      include: listingInclude,
    });

    return { listing };
  }

  async findAll(query: FindListingsQueryDto) {
    const where: Prisma.ListingWhereInput = {
      categoryId: query.categoryId,
      sellerId: query.sellerId,
      status: query.status,
      type: query.type,
      condition: query.condition,
    };

    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: "insensitive" } },
        { description: { contains: query.search, mode: "insensitive" } },
      ];
    }

    const listings = await this.listingsRepo.findMany({
      where,
      include: listingInclude,
      orderBy: { createdAt: "desc" },
    });

    return { listings };
  }

  async findOne(listingId: string) {
    const listing = await this.listingsRepo.findUnique({
      where: { id: listingId },
      include: listingInclude,
    });

    if (!listing) throw new NotFoundException("Listing not found");

    return { listing };
  }

  async update(
    userId: string,
    listingId: string,
    updateListingDto: UpdateListingDto,
  ) {
    const listing = await this.findListingOrThrow(listingId);

    if (listing.sellerId !== userId) {
      throw new ForbiddenException("You cannot update this listing");
    }

    if (updateListingDto.categoryId) {
      await this.ensureCategoryExists(updateListingDto.categoryId);
    }

    const updatedListing = await this.listingsRepo.update({
      where: { id: listingId },
      data: {
        categoryId: updateListingDto.categoryId,
        title: updateListingDto.title,
        description: updateListingDto.description,
        price: updateListingDto.price,
        condition: updateListingDto.condition,
        type: updateListingDto.type,
        status: updateListingDto.status,
        location: updateListingDto.location,
      },
      include: listingInclude,
    });

    return { listing: updatedListing };
  }

  async remove(userId: string, listingId: string) {
    const listing = await this.findListingOrThrow(listingId);

    if (listing.sellerId !== userId) {
      throw new ForbiddenException("You cannot delete this listing");
    }

    await this.listingsRepo.delete({
      where: { id: listingId },
    });
  }

  private async findListingOrThrow(listingId: string) {
    const listing = await this.listingsRepo.findUnique({
      where: { id: listingId },
      select: { id: true, sellerId: true },
    });

    if (!listing) throw new NotFoundException("Listing not found");

    return listing;
  }

  private async ensureCategoryExists(categoryId: string) {
    const category = await this.listingsRepo.findCategoryById(categoryId);

    if (!category) throw new NotFoundException("Category not found");
  }
}
