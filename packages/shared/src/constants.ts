export const APP_NAME = "Latitud360";
export const APP_TAGLINE = "Una latitud. Todas tus operaciones.";
export const APP_DESCRIPTION =
  "El sistema operativo de la minería del NOA. Construido en Catamarca con IA predictiva entrenada para el Triángulo del Litio.";

export const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "latitud360.com";
export const APP_DOMAIN = `app.${ROOT_DOMAIN}`;

/** Tenant resolution */
export const RESERVED_SUBDOMAINS = new Set([
  "www", "app", "api", "admin", "docs", "status", "blog",
  "media", "static", "assets", "cdn", "auth", "login",
  "minera360", "latitud", "contacto", "toori", "demo",
]);

/** Valores culturales por defecto para Recognitions */
export const DEFAULT_VALUES = [
  { key: "seguridad",      label: "Seguridad ante todo",   icon: "🛡️" },
  { key: "trabajo_equipo", label: "Trabajo en equipo",     icon: "🤝" },
  { key: "excelencia",     label: "Excelencia operativa",  icon: "⭐" },
  { key: "innovacion",     label: "Innovación",            icon: "💡" },
  { key: "respeto",        label: "Respeto",               icon: "❤️" },
  { key: "compromiso",     label: "Compromiso",            icon: "🎯" },
] as const;

/** Severidad — mapping a colores semánticos */
export const SEVERITY_META = {
  low:      { label: "Baja",     color: "#00B86B", emoji: "🟢" },
  medium:   { label: "Media",    color: "#FFC93C", emoji: "🟡" },
  high:     { label: "Alta",     color: "#FF6B1A", emoji: "🟠" },
  critical: { label: "Crítica",  color: "#E63946", emoji: "🔴" },
} as const;

export const INCIDENT_TYPE_LABELS = {
  accident:          "Accidente",
  near_miss:         "Casi accidente",
  unsafe_act:        "Acto inseguro",
  unsafe_condition:  "Condición insegura",
  environmental:     "Ambiental",
  property_damage:   "Daño material",
} as const;

export const PERMIT_TYPE_LABELS = {
  height:         "Trabajo en altura",
  confined_space: "Espacios confinados",
  hot_work:       "Trabajo en caliente",
  electrical:     "Eléctrico",
  lifting:        "Izaje",
  excavation:     "Excavación",
  chemical:       "Químico",
} as const;

export const ROLE_LABELS = {
  super_admin:         "Super Admin (Nativos)",
  org_admin:           "Admin de organización",
  product_admin:       "Admin de producto",
  manager:             "Gerente",
  supervisor:          "Supervisor",
  operator:            "Operario",
  auditor:             "Auditor externo",
  external_journalist: "Periodista externo",
} as const;

export const PRODUCT_META = {
  minera360: { label: "Minera360",  color: "#FF6B1A", description: "Operaciones (HSE, Ambiente, Mantenimiento, Capacitación)" },
  contacto:  { label: "Contacto",   color: "#00C2B8", description: "Comunicación interna y RRHH" },
  latitud:   { label: "Latitud",    color: "#D4AF37", description: "Medio sectorial especializado" },
  toori:     { label: "Toori",      color: "#A78BFA", description: "Marketplace de servicios (add-on)" },
} as const;

/** Módulos comerciales con phase de madurez según CLAUDE.md */
export const MODULE_META = {
  // Fase 1 — LIVE Q1 2026
  safetyops:        { label: "SafetyOps",       product: "minera360", phase: "live",      year: "2026 Q1" },
  contacto_basic:   { label: "Contacto Básico", product: "contacto",  phase: "live",      year: "2026 Q1" },
  // Fase 2 — LIVE Q2 2026
  latitud:          { label: "Latitud",         product: "latitud",   phase: "roadmap",   year: "2026 Q2" },
  contacto_full:    { label: "Contacto Full",   product: "contacto",  phase: "roadmap",   year: "2026 Q2" },
  // Fase 3 — Q3 2026
  envirowatch:      { label: "EnviroWatch",     product: "minera360", phase: "roadmap",   year: "2026 Q3" },
  assetiq:          { label: "AssetIQ",         product: "minera360", phase: "roadmap",   year: "2026 Q3" },
  // Fase 4 — Q4 2026
  talentmine:       { label: "TalentMine",      product: "minera360", phase: "roadmap",   year: "2026 Q4" },
  ai_copilot:       { label: "AI Copilot",      product: "core",      phase: "roadmap",   year: "2026 Q4" },
  // Fase 5 — Q4 2026 / 2027
  procurement:      { label: "Procurement",     product: "minera360", phase: "roadmap",   year: "2026 Q4" },
  toori:            { label: "Toori",           product: "toori",     phase: "roadmap",   year: "2026 Q4" },
  // Fase 6 — Año 2 (2027)
  logitrack:        { label: "LogiTrack",       product: "minera360", phase: "explore",   year: "2027" },
  eu_compliance:    { label: "EU Compliance",   product: "minera360", phase: "explore",   year: "2027" },
  // Vertical separado (repo aparte, integrable vía API)
  energiai:         { label: "EnergiAI",        product: "vertical",  phase: "separate",  year: "2026" },
} as const;

/** Planes comerciales — Land&Expand */
export const PLAN_META = {
  pioneer:    { label: "Pionero NOA",       price: 24000,  currency: "USD", description: "Programa lanzamiento -33% año 1 con SafetyOps incluido" },
  starter:    { label: "Starter",           price: 35000,  currency: "USD", description: "Solo SafetyOps — entry door del Land&Expand" },
  growth:     { label: "Growth",            price: 70000,  currency: "USD", description: "SafetyOps + Contacto — expansión natural" },
  enterprise: { label: "Enterprise Bundle", price: 195000, currency: "USD", description: "Bundle completo: SafetyOps + Contacto + EnviroWatch + AssetIQ + TalentMine" },
  custom:     { label: "Custom",            price: 0,      currency: "USD", description: "Negociación específica para enterprise grandes (>2000 empleados)" },
} as const;
