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
import { ListingsService } from "./listings.service";
import { AdminGuard } from "src/shared/guards";
import { IsAdmin } from "src/shared/decorators";

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

  @Get("/admin")
  @UseGuards(AdminGuard)
  @IsAdmin()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

  @Post(":id/images")
  @UseInterceptors(
    FileInterceptor("image", createImageUploadOptions("listings")),
  )
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
