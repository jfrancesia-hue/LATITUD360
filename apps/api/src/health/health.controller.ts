import { Controller, Get } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Controller("health")
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async check() {
    const dbOk = await this.prisma.client
      .$queryRaw`SELECT 1`
      .then(() => true)
      .catch(() => false);

    return {
      status: dbOk ? "ok" : "degraded",
      service: "@latitud360/api",
      version: process.env.npm_package_version ?? "0.1.0",
      timestamp: new Date().toISOString(),
      checks: { database: dbOk ? "ok" : "fail" },
    };
  }
}
