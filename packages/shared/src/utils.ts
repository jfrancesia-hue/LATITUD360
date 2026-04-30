/** Calcula LTIFR (Lost Time Injury Frequency Rate) por 1.000.000 horas */
export function ltifr(lostTimeInjuries: number, totalHoursWorked: number): number {
  if (totalHoursWorked === 0) return 0;
  return (lostTimeInjuries * 1_000_000) / totalHoursWorked;
}

/** TRIFR — Total Recordable Injury Frequency Rate */
export function trifr(totalRecordableInjuries: number, totalHoursWorked: number): number {
  if (totalHoursWorked === 0) return 0;
  return (totalRecordableInjuries * 1_000_000) / totalHoursWorked;
}

/** Severity Rate: días perdidos por millón de horas */
export function severityRate(daysLost: number, totalHoursWorked: number): number {
  if (totalHoursWorked === 0) return 0;
  return (daysLost * 1_000_000) / totalHoursWorked;
}

/** Sólo argentino — formatea moneda */
export function formatARS(value: number): string {
  return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(value);
}

export function formatUSD(value: number): string {
  return new Intl.NumberFormat("es-AR", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
}

export function formatDateAR(d: Date | string): string {
  const date = typeof d === "string" ? new Date(d) : d;
  return new Intl.DateTimeFormat("es-AR", { year: "numeric", month: "long", day: "numeric" }).format(date);
}

export function formatRelativeAR(d: Date | string): string {
  const date = typeof d === "string" ? new Date(d) : d;
  const diff = (Date.now() - date.getTime()) / 1000;
  const rtf = new Intl.RelativeTimeFormat("es-AR", { numeric: "auto" });
  if (diff < 60) return rtf.format(-Math.round(diff), "second");
  if (diff < 3600) return rtf.format(-Math.round(diff / 60), "minute");
  if (diff < 86400) return rtf.format(-Math.round(diff / 3600), "hour");
  if (diff < 86400 * 30) return rtf.format(-Math.round(diff / 86400), "day");
  if (diff < 86400 * 365) return rtf.format(-Math.round(diff / (86400 * 30)), "month");
  return rtf.format(-Math.round(diff / (86400 * 365)), "year");
}

export function daysBetween(a: Date | string, b: Date | string): number {
  const da = typeof a === "string" ? new Date(a) : a;
  const db = typeof b === "string" ? new Date(b) : b;
  return Math.ceil((db.getTime() - da.getTime()) / (1000 * 60 * 60 * 24));
}

export function initials(fullName: string): string {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return (parts[0]![0]! + parts[parts.length - 1]![0]!).toUpperCase();
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
