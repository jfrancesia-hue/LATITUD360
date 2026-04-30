import { Body, Controller, Get, Param, Post, UsePipes } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { postCreateSchema, recognitionCreateSchema, type PostCreate, type RecognitionCreate } from "@latitud360/shared";
import { PostsService } from "./posts.service";
import { CurrentTenant } from "../../common/tenant.decorator";
import { ZodValidationPipe } from "../../common/zod-validation.pipe";

@ApiTags("posts")
@Controller("posts")
export class PostsController {
  constructor(private readonly svc: PostsService) {}

  @Get("feed")
  @ApiOperation({ summary: "Feed Contacto del tenant" })
  feed(@CurrentTenant() ctx: { organizationId: string }) {
    return this.svc.feed(ctx.organizationId);
  }

  @Post()
  @ApiOperation({ summary: "Crear publicación" })
  @UsePipes(new ZodValidationPipe(postCreateSchema))
  create(@CurrentTenant() ctx: { organizationId: string; userId: string }, @Body() data: PostCreate) {
    return this.svc.create(ctx.organizationId, ctx.userId, data);
  }

  @Post(":id/ack")
  @ApiOperation({ summary: "Confirmar lectura" })
  ack(@CurrentTenant() ctx: { userId: string }, @Param("id") id: string) {
    return this.svc.ack(id, ctx.userId);
  }

  @Post(":id/react")
  @ApiOperation({ summary: "Reaccionar a un post" })
  react(
    @CurrentTenant() ctx: { userId: string },
    @Param("id") id: string,
    @Body("type") type: "like" | "applause" | "heart" | "idea",
  ) {
    return this.svc.react(id, ctx.userId, type);
  }

  @Post("recognitions")
  @ApiOperation({ summary: "Reconocer a un compañero" })
  @UsePipes(new ZodValidationPipe(recognitionCreateSchema))
  recognize(@CurrentTenant() ctx: { organizationId: string; userId: string }, @Body() data: RecognitionCreate) {
    return this.svc.recognize(ctx.organizationId, ctx.userId, data);
  }
}
