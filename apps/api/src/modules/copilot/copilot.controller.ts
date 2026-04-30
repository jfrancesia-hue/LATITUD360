import { Body, Controller, Post, Res } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import type { Response } from "express";
import { CopilotService } from "./copilot.service";
import { CurrentTenant } from "../../common/tenant.decorator";

interface ChatRequest {
  messages: { role: "user" | "assistant"; content: string }[];
}

@ApiTags("copilot")
@Controller("copilot")
export class CopilotController {
  constructor(private readonly svc: CopilotService) {}

  @Post("chat")
  @ApiOperation({ summary: "Stream chat con Latitud Copilot (Claude)" })
  async chat(
    @CurrentTenant() ctx: { organizationId: string },
    @Body() body: ChatRequest,
    @Res() res: Response,
  ) {
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache, no-transform");
    res.setHeader("X-Accel-Buffering", "no");

    const stream = await this.svc.streamChat(ctx.organizationId, body.messages);
    for await (const chunk of stream) {
      res.write(chunk);
    }
    res.end();
  }

  @Post("embed")
  @ApiOperation({ summary: "Generar embedding (OpenAI)" })
  async embed(@Body("text") text: string) {
    const v = await this.svc.embed(text);
    return { dim: v.length, embedding: v };
  }
}
