import { Resend } from "resend";
import type { NotificationResult } from "./types";

let client: Resend | null = null;

function getClient(): Resend | null {
  if (client) return client;
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  client = new Resend(key);
  return client;
}

interface SendEmailInput {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail({ to, subject, html, text }: SendEmailInput): Promise<NotificationResult> {
  const c = getClient();
  if (!c) {
    return { ok: false, channel: "email", error: "RESEND_API_KEY missing" };
  }
  const from = process.env.RESEND_FROM_EMAIL ?? "alertas@latitud360.com";
  try {
    const r = await c.emails.send({ from, to, subject, html, text });
    if (r.error) return { ok: false, channel: "email", error: r.error.message };
    return { ok: true, channel: "email", providerId: r.data?.id };
  } catch (e) {
    return { ok: false, channel: "email", error: e instanceof Error ? e.message : "Unknown error" };
  }
}
