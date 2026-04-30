import { Expo, type ExpoPushMessage, type ExpoPushTicket } from "expo-server-sdk";
import type { NotificationResult } from "./types";

let expo: Expo | null = null;

function getClient(): Expo {
  if (expo) return expo;
  expo = new Expo({
    accessToken: process.env.EXPO_ACCESS_TOKEN,
    useFcmV1: true,
  });
  return expo;
}

interface SendPushInput {
  tokens: string[];
  title: string;
  body: string;
  data?: Record<string, unknown>;
  sound?: "default" | null;
  badge?: number;
  channelId?: string;     // Android channels
}

export async function sendPush(input: SendPushInput): Promise<NotificationResult[]> {
  const validTokens = input.tokens.filter((t) => Expo.isExpoPushToken(t));
  if (validTokens.length === 0) {
    return [{ ok: false, channel: "push", error: "No valid Expo push tokens" }];
  }

  const messages: ExpoPushMessage[] = validTokens.map((token) => ({
    to: token,
    title: input.title,
    body: input.body,
    data: input.data ?? {},
    sound: input.sound ?? "default",
    badge: input.badge,
    channelId: input.channelId ?? "default",
  }));

  const client = getClient();
  const chunks = client.chunkPushNotifications(messages);
  const results: NotificationResult[] = [];

  for (const chunk of chunks) {
    try {
      const tickets: ExpoPushTicket[] = await client.sendPushNotificationsAsync(chunk);
      for (const ticket of tickets) {
        if (ticket.status === "ok") {
          results.push({ ok: true, channel: "push", providerId: ticket.id });
        } else {
          results.push({ ok: false, channel: "push", error: ticket.message });
        }
      }
    } catch (e) {
      results.push({ ok: false, channel: "push", error: e instanceof Error ? e.message : "Unknown error" });
    }
  }
  return results;
}
