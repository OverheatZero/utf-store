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
} from "@nestjs/common";
import { ActiveUserId } from "src/shared/decorators/ActiveUserId";
import { IsPublic } from "src/shared/decorators/IsPublic";
import { CreateListingDto } from "./dto/create-listing.dto";
import { FindListingsQueryDto } from "./dto/find-listings-query.dto";
import { UpdateListingDto } from "./dto/update-listing.dto";
import { ListingsService } from "./listings.service";

@Controller("listings")
export class ListingsController {
  constructor(private readonly listingsService: ListingsService) {}

  @Post()
  create(
    @ActiveUserId() userId: string,
    @Body() createListingDto: CreateListingDto,
  ) {
    return this.listingsService.create(userId, createListingDto);
  }

  @Get()
  @IsPublic()
  findAll(@Query() query: FindListingsQueryDto) {
    return this.listingsService.findAll(query);
  }

  @Get(":id")
  @IsPublic()
  findOne(@Param("id", ParseUUIDPipe) listingId: string) {
    return this.listingsService.findOne(listingId);
  }

  @Patch(":id")
  update(
    @ActiveUserId() userId: string,
    @Param("id", ParseUUIDPipe) listingId: string,
    @Body() updateListingDto: UpdateListingDto,
  ) {
    return this.listingsService.update(userId, listingId, updateListingDto);
  }

  @Delete(":id")
  remove(
    @ActiveUserId() userId: string,
    @Param("id", ParseUUIDPipe) listingId: string,
  ) {
    return this.listingsService.remove(userId, listingId);
  }
}
