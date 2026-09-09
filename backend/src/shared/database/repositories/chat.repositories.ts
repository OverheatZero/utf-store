import { Injectable } from "@nestjs/common";
import { type Prisma } from "generated/prisma/client";
import { PrismaService } from "../prisma.service";

@Injectable()
export class ChatRepository {
  constructor(private readonly prismaService: PrismaService) {}

  create(createDto: Prisma.MessageCreateArgs) {
    return this.prismaService.message.create(createDto);
  }

  findMany(findManyDto: Prisma.MessageFindManyArgs) {
    return this.prismaService.message.findMany(findManyDto);
  }

  findUnique(findUniqueDto: Prisma.MessageFindUniqueArgs) {
    return this.prismaService.message.findUnique(findUniqueDto);
  }

  update(updateDto: Prisma.MessageUpdateArgs) {
    return this.prismaService.message.update(updateDto);
  }

  findUserById(userId: string) {
    return this.prismaService.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });
  }

  findListingById(listingId: string) {
    return this.prismaService.listing.findUnique({
      where: { id: listingId },
      select: { id: true },
    });
  }
}
