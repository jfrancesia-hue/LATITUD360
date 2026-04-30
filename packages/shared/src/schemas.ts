/**
 * Zod schemas — validación de inputs en la frontera (API y forms).
 * Aplicación del pilar 2 de seguridad: validar todo input antes de tocar DB.
 */
import { z } from "zod";

const uuid = z.string().uuid();
const cuit = z.string().regex(/^\d{2}-\d{8}-\d$/);
const dni = z.string().regex(/^\d{7,9}$/);
const isoDate = z.string().datetime().or(z.date());

// ─── Org ──────────────────────────────────────────────────────────
export const orgCreateSchema = z.object({
  slug: z.string().min(3).max(40).regex(/^[a-z0-9-]+$/, "slug solo minúsculas, números y guiones"),
  name: z.string().min(2).max(120),
  legalName: z.string().max(200).optional(),
  taxId: cuit.optional(),
  province: z.string().max(60).optional(),
  size: z.enum(["small", "medium", "large", "enterprise"]).optional(),
});
export type OrgCreate = z.infer<typeof orgCreateSchema>;

// ─── User ─────────────────────────────────────────────────────────
export const userInviteSchema = z.object({
  email: z.string().email(),
  fullName: z.string().min(2).max(120),
  role: z.enum([
    "super_admin", "org_admin", "product_admin",
    "manager", "supervisor", "operator", "auditor", "external_journalist",
  ]),
  dni: dni.optional(),
  phone: z.string().max(20).optional(),
  jobTitle: z.string().max(120).optional(),
  birthDate: isoDate.optional(),
  hireDate: isoDate.optional(),
});
export type UserInvite = z.infer<typeof userInviteSchema>;

// ─── Site ─────────────────────────────────────────────────────────
export const siteCreateSchema = z.object({
  name: z.string().min(2).max(120),
  type: z.enum(["mine", "plant", "office", "port", "warehouse", "camp"]),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  altitude: z.number().int().min(-500).max(8000).optional(),
  address: z.string().max(200).optional(),
  province: z.string().max(60).optional(),
});
export type SiteCreate = z.infer<typeof siteCreateSchema>;

// ─── Daily Report ─────────────────────────────────────────────────
export const dailyReportCreateSchema = z.object({
  siteId: uuid,
  areaId: uuid.optional(),
  shift: z.enum(["morning", "afternoon", "night"]),
  reportDate: isoDate,
  weatherCondition: z.string().max(280).optional(),
  productionData: z.record(z.union([z.string(), z.number()])).optional(),
  observations: z.string().max(4000).optional(),
  photoUrls: z.array(z.string().url()).max(10).default([]),
});
export type DailyReportCreate = z.infer<typeof dailyReportCreateSchema>;

// ─── Incident ─────────────────────────────────────────────────────
export const incidentCreateSchema = z.object({
  siteId: uuid,
  areaId: uuid.optional(),
  type: z.enum([
    "accident", "near_miss", "unsafe_act", "unsafe_condition",
    "environmental", "property_damage",
  ]),
  severity: z.enum(["low", "medium", "high", "critical"]),
  title: z.string().min(5).max(200),
  description: z.string().min(10).max(4000),
  occurredAt: isoDate,
  involvedUserIds: z.array(uuid).max(50).default([]),
  injuryType: z.string().max(120).optional(),
  daysLost: z.number().int().min(0).max(3650).optional(),
  location: z.object({
    lat: z.number().optional(),
    lng: z.number().optional(),
    notes: z.string().optional(),
  }).optional(),
  photoUrls: z.array(z.string().url()).max(10).default([]),
  videoUrls: z.array(z.string().url()).max(5).default([]),
});
export type IncidentCreate = z.infer<typeof incidentCreateSchema>;

// ─── Investigation 5 Por Qué ─────────────────────────────────────
export const investigationCreateSchema = z.object({
  incidentId: uuid,
  method: z.enum(["5_porques", "bowtie", "icam"]).default("5_porques"),
  rootCauses: z.array(z.object({
    cause: z.string().min(5).max(500),
    evidence: z.string().max(1000).optional(),
    depth: z.number().int().min(1).max(5),
  })).min(1),
  immediateActions: z.array(z.string().min(3).max(500)).default([]),
  preventiveActions: z.array(z.object({
    action: z.string().min(3).max(500),
    assignedToId: uuid,
    dueDate: isoDate,
    status: z.enum(["open", "in_progress", "completed", "verified"]).default("open"),
  })).default([]),
  conclusions: z.string().max(4000).optional(),
});
export type InvestigationCreate = z.infer<typeof investigationCreateSchema>;

// ─── Work Permit ──────────────────────────────────────────────────
export const workPermitCreateSchema = z.object({
  siteId: uuid,
  areaId: uuid.optional(),
  permitType: z.enum([
    "height", "confined_space", "hot_work", "electrical",
    "lifting", "excavation", "chemical",
  ]),
  workerIds: z.array(uuid).min(1).max(20),
  description: z.string().min(10).max(2000),
  riskAssessment: z.object({
    risks: z.array(z.string()).min(1),
    mitigations: z.array(z.string()).min(1),
    matrix: z.object({ probability: z.number().int().min(1).max(5), impact: z.number().int().min(1).max(5) }).optional(),
  }),
  ppeRequired: z.array(z.string()).min(1),
  validFrom: isoDate,
  validUntil: isoDate,
}).refine(
  (data) => new Date(data.validUntil) > new Date(data.validFrom),
  { message: "validUntil debe ser posterior a validFrom", path: ["validUntil"] }
);
export type WorkPermitCreate = z.infer<typeof workPermitCreateSchema>;

// ─── Post (Contacto) ──────────────────────────────────────────────
export const postCreateSchema = z.object({
  type: z.enum(["announcement", "news", "recognition", "poll", "event", "policy"]),
  title: z.string().max(200).optional(),
  content: z.string().min(1).max(10000),
  mediaUrls: z.array(z.string().url()).max(10).default([]),
  audience: z.enum(["all", "site", "area", "role", "custom"]),
  audienceFilter: z.record(z.unknown()).optional(),
  requiresAck: z.boolean().default(false),
  publishedAt: isoDate.optional(),
  expiresAt: isoDate.optional(),
  pinned: z.boolean().default(false),
});
export type PostCreate = z.infer<typeof postCreateSchema>;

// ─── Recognition ──────────────────────────────────────────────────
export const recognitionCreateSchema = z.object({
  toUserId: uuid,
  value: z.string().min(2).max(80),
  message: z.string().min(5).max(1000),
  isPublic: z.boolean().default(true),
  photoUrl: z.string().url().optional(),
});
export type RecognitionCreate = z.infer<typeof recognitionCreateSchema>;

// ─── PPE (catálogo + asignaciones) ────────────────────────────────
export const ppeCreateSchema = z.object({
  name: z.string().min(2).max(120),
  category: z.enum(["head", "eye", "hand", "foot", "body", "respiratory"]),
  brand: z.string().max(120).optional(),
  model: z.string().max(120).optional(),
  certificationStandard: z.string().max(120).optional(),
  shelfLifeMonths: z.number().int().min(1).max(240).optional(),
  stock: z.number().int().min(0).default(0),
  imageUrl: z.string().url().optional(),
  isCritical: z.boolean().default(false),
});
export type PpeCreate = z.infer<typeof ppeCreateSchema>;

export const ppeAssignSchema = z.object({
  ppeId: uuid,
  userId: uuid,
  expiresAt: isoDate.optional(),
  signedReceipt: z.boolean().default(false),
  signatureUrl: z.string().url().optional(),
});
export type PpeAssign = z.infer<typeof ppeAssignSchema>;

// ─── Inspections (templates + ejecuciones + findings) ────────────
export const inspectionTemplateItemSchema = z.object({
  id: z.string().min(1),
  question: z.string().min(3).max(500),
  type: z.enum(["yes_no", "scale", "photo_required", "free_text", "location"]),
  required: z.boolean().default(true),
  riskLevel: z.enum(["low", "medium", "high", "critical"]).optional(),
});

export const inspectionCreateSchema = z.object({
  siteId: uuid,
  type: z.string().min(2).max(80), // safety_walk | equipment | environmental | custom
  scheduledFor: isoDate,
  template: z.array(inspectionTemplateItemSchema).min(1).max(200),
});
export type InspectionCreate = z.infer<typeof inspectionCreateSchema>;

export const inspectionResultSchema = z.object({
  itemId: z.string().min(1),
  answer: z.union([z.boolean(), z.number(), z.string()]),
  photoUrl: z.string().url().optional(),
  notes: z.string().max(1000).optional(),
});

export const inspectionCompleteSchema = z.object({
  results: z.array(inspectionResultSchema).min(1),
  signatureUrl: z.string().url().optional(),
});
export type InspectionComplete = z.infer<typeof inspectionCompleteSchema>;

export const findingCreateSchema = z.object({
  description: z.string().min(5).max(1000),
  severity: z.enum(["low", "medium", "high", "critical"]),
  photoUrl: z.string().url().optional(),
  assignedToId: uuid.optional(),
  dueDate: isoDate.optional(),
});
export type FindingCreate = z.infer<typeof findingCreateSchema>;

// ─── Profile (Contacto) ───────────────────────────────────────────
export const profileUpdateSchema = z.object({
  fullName: z.string().min(2).max(120).optional(),
  phone: z.string().max(20).optional(),
  avatarUrl: z.string().url().optional(),
  jobTitle: z.string().max(120).optional(),
  birthDate: isoDate.optional(),
});
export type ProfileUpdate = z.infer<typeof profileUpdateSchema>;

// ─── Auth ─────────────────────────────────────────────────────────
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(200),
});
export type LoginInput = z.infer<typeof loginSchema>;
