import { Injectable, OnModuleInit } from "@nestjs/common";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "generated/prisma/client";
import { env } from "src/shared/config/env";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    super({
      adapter: new PrismaPg({ connectionString: env.dbURL }),
    });
  }

  async onModuleInit() {
    await this.$connect();
  }
}
