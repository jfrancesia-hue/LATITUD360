import type { NotificationType, NotificationChannel } from "@latitud360/database";

export interface NotificationPayload {
  userId: string;
  organizationId: string;
  type: NotificationType;
  channel: NotificationChannel;
  title: string;
  body?: string;
  data?: Record<string, unknown>;
}

export interface NotificationResult {
  ok: boolean;
  channel: NotificationChannel;
  providerId?: string;
  error?: string;
}

export interface RecipientChannelData {
  email?: string;
  phone?: string;
  whatsapp?: string;
  expoPushToken?: string;
}

export interface RenderedTemplate {
  subject: string;
  html: string;
  text: string;
  whatsappBody: string;
  pushTitle: string;
  pushBody: string;
}
