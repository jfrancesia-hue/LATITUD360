import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { prisma } from "@latitud360/database";
import type { PrismaClient } from "@latitud360/database";

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  client: PrismaClient = prisma;

  async onModuleInit() {
    await this.client.$connect();
  }
  async onModuleDestroy() {
    await this.client.$disconnect();
  }
}
