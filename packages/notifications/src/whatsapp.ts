import twilio from "twilio";
import type { NotificationResult } from "./types";

let client: ReturnType<typeof twilio> | null = null;

function getClient() {
  if (client) return client;
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  if (!sid || !token) return null;
  client = twilio(sid, token);
  return client;
}

interface SendWhatsAppInput {
  to: string;            // E.164 format: +5491134567890
  body: string;
  mediaUrl?: string;
}

export async function sendWhatsApp({ to, body, mediaUrl }: SendWhatsAppInput): Promise<NotificationResult> {
  const c = getClient();
  if (!c) {
    return { ok: false, channel: "whatsapp", error: "TWILIO env vars missing" };
  }
  const from = process.env.TWILIO_WHATSAPP_FROM ?? "whatsapp:+14155238886";
  try {
    const msg = await c.messages.create({
      from,
      to: to.startsWith("whatsapp:") ? to : `whatsapp:${to}`,
      body,
      ...(mediaUrl ? { mediaUrl: [mediaUrl] } : {}),
    });
    return { ok: true, channel: "whatsapp", providerId: msg.sid };
  } catch (e) {
    return { ok: false, channel: "whatsapp", error: e instanceof Error ? e.message : "Unknown error" };
  }
}
