import { Module } from "@nestjs/common";
import { RecognitionsController } from "./recognitions.controller";
import { RecognitionsService } from "./recognitions.service";

@Module({
  controllers: [RecognitionsController],
  providers: [RecognitionsService],
  exports: [RecognitionsService],
})
export class RecognitionsModule {}
