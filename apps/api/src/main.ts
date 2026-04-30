import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { ValidationPipe, Logger } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import helmet from "helmet";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const logger = new Logger("Bootstrap");

  app.use(helmet({ contentSecurityPolicy: false }));
  app.setGlobalPrefix("v1");
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: true }));

  const swaggerConfig = new DocumentBuilder()
    .setTitle("Latitud360 API")
    .setDescription("API REST de Latitud360 — multi-tenant minero NOA")
    .setVersion("1.0")
    .addBearerAuth()
    .build();
  const doc = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup("v1/docs", app, doc);

  const port = parseInt(process.env.PORT ?? "3001", 10);
  await app.listen(port);
  logger.log(`🚀 Latitud360 API running on http://localhost:${port}/v1`);
  logger.log(`📚 Swagger docs: http://localhost:${port}/v1/docs`);
}
bootstrap();
