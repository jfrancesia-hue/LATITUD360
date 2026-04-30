import Fastify from "fastify";
import { z } from "zod";
import { runDailyRiskAgent } from "./agents/daily-risk.agent";
import { runOpsAssistant } from "./agents/ops-assistant.agent";
import { embedText } from "./tools/embeddings";

const app = Fastify({ logger: { transport: { target: "pino-pretty" } } });

app.get("/health", async () => ({
  status: "ok",
  service: "@latitud360/ai-copilot",
  version: "0.1.0",
  timestamp: new Date().toISOString(),
  providers: {
    anthropic: !!process.env.ANTHROPIC_API_KEY,
    openai: !!process.env.OPENAI_API_KEY,
  },
}));

const riskSchema = z.object({
  organizationId: z.string().uuid(),
  horizonHours: z.number().int().min(1).max(168).default(24),
});

app.post("/agents/daily-risk", async (req, reply) => {
  const parsed = riskSchema.safeParse(req.body);
  if (!parsed.success) return reply.code(400).send({ error: parsed.error.flatten() });
  const result = await runDailyRiskAgent(parsed.data);
  return result;
});

const opsSchema = z.object({
  organizationId: z.string().uuid(),
  question: z.string().min(2).max(2000),
  history: z.array(z.object({
    role: z.enum(["user", "assistant"]),
    content: z.string(),
  })).max(20).default([]),
});

app.post("/agents/ops-assistant", async (req, reply) => {
  const parsed = opsSchema.safeParse(req.body);
  if (!parsed.success) return reply.code(400).send({ error: parsed.error.flatten() });
  const out = await runOpsAssistant(parsed.data);
  return { answer: out };
});

app.post("/tools/embed", async (req: any, reply) => {
  const text = String(req.body?.text ?? "");
  if (!text) return reply.code(400).send({ error: "text requerido" });
  const v = await embedText(text);
  return { dim: v.length, embedding: v };
});

const port = parseInt(process.env.PORT ?? "3002", 10);
app.listen({ port, host: "0.0.0.0" }).then(() => {
  app.log.info(`🤖 Latitud Copilot AI service listening on :${port}`);
});
