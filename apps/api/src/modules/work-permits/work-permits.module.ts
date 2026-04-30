import { Module } from "@nestjs/common";
import { WorkPermitsController } from "./work-permits.controller";
import { WorkPermitsService } from "./work-permits.service";

@Module({
  controllers: [WorkPermitsController],
  providers: [WorkPermitsService],
})
export class WorkPermitsModule {}
