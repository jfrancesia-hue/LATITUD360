/**
 * Templates en español argentino para notificaciones críticas.
 * Cada template recibe `data` con campos contextuales y retorna
 * versiones para email, WhatsApp y push.
 */
import type { NotificationType } from "@latitud360/database";
import type { RenderedTemplate } from "./types";

interface TemplateContext {
  recipientName?: string;
  data: Record<string, unknown>;
}

const wrap = (body: string) => `<!DOCTYPE html>
<html lang="es-AR"><head><meta charset="utf-8" /><style>
  body { font-family: -apple-system, BlinkMacSystemFont, "Barlow", sans-serif; background: #0A0A0A; color: #F5F5F5; margin: 0; padding: 32px; }
  .card { max-width: 560px; margin: 0 auto; background: #1F1F1F; border-radius: 16px; padding: 32px; }
  h1 { font-family: "Instrument Serif", serif; font-style: italic; font-size: 32px; line-height: 1.1; margin: 0 0 16px; letter-spacing: -0.02em; }
  p { line-height: 1.6; margin: 0 0 12px; }
  .cta { display: inline-block; background: #FF6B1A; color: #fff !important; padding: 12px 24px; border-radius: 9999px; text-decoration: none; font-weight: 500; margin-top: 16px; }
  .footer { color: rgba(255,255,255,0.5); font-size: 12px; margin-top: 32px; padding-top: 16px; border-top: 1px solid #2A2A2A; }
  .severity-critical { color: #E63946; font-weight: 600; }
  .severity-high { color: #FF6B1A; font-weight: 600; }
</style></head><body><div class="card">${body}<div class="footer">Latitud360 · Una latitud. Todas tus operaciones. · Catamarca, Argentina</div></div></body></html>`;

const templates: Record<NotificationType, (ctx: TemplateContext) => RenderedTemplate> = {
  incident_critical: ({ recipientName, data }) => {
    const sev = String(data.severity ?? "critical").toUpperCase();
    const title = String(data.title ?? "Incidente reportado");
    const reporter = String(data.reporter ?? "Operario");
    const url = String(data.url ?? "https://app.latitud360.com/dashboard/minera360/incidentes");
    return {
      subject: `🔴 INCIDENTE ${sev}: ${title}`,
      html: wrap(`<h1>Incidente <span class="severity-${sev.toLowerCase()}">${sev}</span> reportado</h1>
        <p>${recipientName ? `Hola ${recipientName}, ` : ""}${reporter} acaba de reportar un incidente de severidad <strong>${sev}</strong>:</p>
        <p><strong>${title}</strong></p>
        <p>Necesitamos tu atención inmediata para iniciar la investigación.</p>
        <a class="cta" href="${url}">Ver el incidente</a>`),
      text: `INCIDENTE ${sev}: ${title}\n\n${reporter} acaba de reportarlo. Ver: ${url}`,
      whatsappBody: `🔴 *INCIDENTE ${sev}*\n\n${title}\n\nReportado por ${reporter}.\nVer: ${url}`,
      pushTitle: `🔴 Incidente ${sev}`,
      pushBody: title,
    };
  },

  incident_assigned: ({ recipientName, data }) => {
    const title = String(data.title ?? "Incidente");
    const url = String(data.url ?? "");
    return {
      subject: `Te asignaron un incidente: ${title}`,
      html: wrap(`<h1>Te asignaron un incidente</h1><p>${recipientName ? `Hola ${recipientName}, ` : ""}sos responsable de la investigación de:</p><p><strong>${title}</strong></p><a class="cta" href="${url}">Ver detalle</a>`),
      text: `Te asignaron incidente: ${title}. Ver: ${url}`,
      whatsappBody: `📋 Te asignaron un incidente: *${title}*\nVer: ${url}`,
      pushTitle: "Incidente asignado",
      pushBody: title,
    };
  },

  permit_pending_approval: ({ data }) => {
    const permitType = String(data.permitType ?? "trabajo");
    const requester = String(data.requester ?? "Supervisor");
    const url = String(data.url ?? "");
    return {
      subject: `Permiso de ${permitType} pendiente de aprobación`,
      html: wrap(`<h1>Permiso pendiente</h1><p>${requester} solicitó un permiso de <strong>${permitType}</strong>. Necesita tu aprobación.</p><a class="cta" href="${url}">Revisar</a>`),
      text: `Permiso ${permitType} pendiente. Solicitado por ${requester}. ${url}`,
      whatsappBody: `🛂 *Permiso pendiente*\nTipo: ${permitType}\nSolicitante: ${requester}\nRevisar: ${url}`,
      pushTitle: "Permiso pendiente",
      pushBody: `${permitType} · solicitado por ${requester}`,
    };
  },

  permit_approved: ({ recipientName, data }) => {
    const permitType = String(data.permitType ?? "trabajo");
    const url = String(data.url ?? "");
    return {
      subject: `Permiso de ${permitType} APROBADO`,
      html: wrap(`<h1>Permiso aprobado</h1><p>${recipientName ? `${recipientName}, ` : ""}tu permiso de <strong>${permitType}</strong> fue aprobado.</p><a class="cta" href="${url}">Ver permiso</a>`),
      text: `Permiso ${permitType} aprobado. ${url}`,
      whatsappBody: `✅ *Permiso aprobado*\nTipo: ${permitType}\n${url}`,
      pushTitle: "Permiso aprobado",
      pushBody: permitType,
    };
  },

  permit_rejected: ({ recipientName, data }) => {
    const permitType = String(data.permitType ?? "trabajo");
    const reason = String(data.reason ?? "—");
    return {
      subject: `Permiso de ${permitType} RECHAZADO`,
      html: wrap(`<h1>Permiso rechazado</h1><p>${recipientName ? `${recipientName}, ` : ""}tu permiso de <strong>${permitType}</strong> fue rechazado.</p><p><strong>Motivo:</strong> ${reason}</p>`),
      text: `Permiso ${permitType} rechazado. Motivo: ${reason}`,
      whatsappBody: `❌ *Permiso rechazado*\nTipo: ${permitType}\nMotivo: ${reason}`,
      pushTitle: "Permiso rechazado",
      pushBody: `${permitType} · ${reason}`,
    };
  },

  ppe_expiring: ({ recipientName, data }) => {
    const ppe = String(data.ppe ?? "EPP");
    const days = Number(data.days ?? 30);
    return {
      subject: `Tu ${ppe} vence en ${days} días`,
      html: wrap(`<h1>EPP por vencer</h1><p>${recipientName ? `${recipientName}, ` : ""}tu <strong>${ppe}</strong> vence en ${days} días. Coordiná reposición con tu supervisor.</p>`),
      text: `${ppe} vence en ${days} días. Coordiná reposición.`,
      whatsappBody: `⚠️ Tu *${ppe}* vence en ${days} días. Hablá con tu supervisor.`,
      pushTitle: "EPP por vencer",
      pushBody: `${ppe} · ${days} días`,
    };
  },

  inspection_scheduled: ({ recipientName, data }) => {
    const type = String(data.type ?? "inspección");
    const date = String(data.scheduledFor ?? "próximamente");
    const url = String(data.url ?? "");
    return {
      subject: `Inspección programada: ${type}`,
      html: wrap(`<h1>Inspección programada</h1><p>${recipientName ? `${recipientName}, ` : ""}tenés una <strong>${type}</strong> programada para <strong>${date}</strong>.</p><a class="cta" href="${url}">Ver detalle</a>`),
      text: `Inspección ${type} programada para ${date}. ${url}`,
      whatsappBody: `📋 Inspección *${type}* programada para ${date}`,
      pushTitle: "Inspección programada",
      pushBody: `${type} · ${date}`,
    };
  },

  post_announcement: ({ data }) => {
    const title = String(data.title ?? "Comunicado");
    const author = String(data.author ?? "");
    const url = String(data.url ?? "");
    return {
      subject: `Nuevo comunicado: ${title}`,
      html: wrap(`<h1>${title}</h1>${author ? `<p>De: ${author}</p>` : ""}<a class="cta" href="${url}">Leer y confirmar</a>`),
      text: `Nuevo comunicado: ${title}. ${url}`,
      whatsappBody: `📌 Nuevo comunicado: *${title}*\n${url}`,
      pushTitle: "Nuevo comunicado",
      pushBody: title,
    };
  },

  post_recognition: ({ recipientName, data }) => {
    const fromName = String(data.fromName ?? "Un compañero");
    const value = String(data.value ?? "trabajo");
    const message = String(data.message ?? "");
    return {
      subject: `${fromName} te reconoció por ${value}`,
      html: wrap(`<h1>Te reconocieron 🏆</h1><p>${recipientName ? `${recipientName}, ` : ""}<strong>${fromName}</strong> te reconoció por <em>${value}</em>:</p><p>"${message}"</p>`),
      text: `${fromName} te reconoció por ${value}: "${message}"`,
      whatsappBody: `🏆 *${fromName}* te reconoció por *${value}*:\n"${message}"`,
      pushTitle: "Te reconocieron 🏆",
      pushBody: `${fromName} · ${value}`,
    };
  },

  birthday: ({ recipientName, data }) => ({
    subject: `🎂 ¡Feliz cumple, ${recipientName ?? data.name ?? "compañero"}!`,
    html: wrap(`<h1>🎂 ¡Feliz cumpleaños!</h1><p>De parte de todo el equipo, te deseamos un día genial.</p>`),
    text: `🎂 ¡Feliz cumple!`,
    whatsappBody: `🎂 ¡Feliz cumple, ${recipientName ?? "compañero"}!`,
    pushTitle: "🎂 ¡Feliz cumple!",
    pushBody: "Te desea todo el equipo",
  }),

  work_anniversary: ({ recipientName, data }) => {
    const years = Number(data.years ?? 1);
    return {
      subject: `🏅 Hoy cumplís ${years} años en la empresa`,
      html: wrap(`<h1>🏅 ${years} años con nosotros</h1><p>${recipientName ? `${recipientName}, ` : ""}gracias por estos ${years} años de compromiso.</p>`),
      text: `🏅 ${years} años con nosotros. Gracias.`,
      whatsappBody: `🏅 Hoy cumplís *${years} años* en la empresa. ¡Gracias!`,
      pushTitle: "🏅 Aniversario laboral",
      pushBody: `${years} años — gracias`,
    };
  },

  vacation_status: ({ data }) => {
    const status = String(data.status ?? "actualizada");
    return {
      subject: `Solicitud de vacaciones ${status}`,
      html: wrap(`<h1>Vacaciones</h1><p>Tu solicitud fue marcada como: <strong>${status}</strong>.</p>`),
      text: `Solicitud de vacaciones: ${status}`,
      whatsappBody: `🌴 Solicitud de vacaciones: *${status}*`,
      pushTitle: "Vacaciones",
      pushBody: status,
    };
  },
};

export function renderTemplate(type: NotificationType, ctx: TemplateContext): RenderedTemplate {
  const fn = templates[type];
  if (!fn) {
    return {
      subject: "Notificación de Latitud360",
      html: wrap(`<h1>Notificación</h1><p>${ctx.data.body ?? ""}</p>`),
      text: String(ctx.data.body ?? ""),
      whatsappBody: String(ctx.data.body ?? ""),
      pushTitle: "Latitud360",
      pushBody: String(ctx.data.body ?? ""),
    };
  }
  return fn(ctx);
}
