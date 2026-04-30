/**
 * RBAC granular — Latitud360
 *
 * Modelo: { rol → producto → módulo → acción }
 * Acciones: read | write | approve | delete
 *
 * El check sigue: "puede el rol X ejecutar acción Y sobre el módulo Z del producto P".
 * Para super_admin (Nativos staff), siempre true.
 */
import type { Role, Product } from "@latitud360/database";

export type Action = "read" | "write" | "approve" | "delete";
export type Module =
  // Minera360
  | "daily_report" | "incident" | "investigation" | "permit"
  | "ppe" | "inspection" | "report"
  // Contacto
  | "post" | "recognition" | "vacation" | "payslip" | "onboarding" | "survey" | "directory"
  // Latitud
  | "article" | "sponsor" | "interview" | "newsletter" | "stream"
  // Core
  | "user" | "site" | "area" | "subscription" | "audit" | "billing";

type Matrix = Partial<Record<Role, Partial<Record<Product, Partial<Record<Module, Action[]>>>>>>;

const ALL: Action[] = ["read", "write", "approve", "delete"];
const RW: Action[] = ["read", "write"];
const RWA: Action[] = ["read", "write", "approve"];
const R: Action[] = ["read"];

const matrix: Matrix = {
  super_admin: {}, // bypass total — manejado en `can()`

  org_admin: {
    minera360: { daily_report: ALL, incident: ALL, investigation: ALL, permit: ALL, ppe: ALL, inspection: ALL, report: ALL },
    contacto:  { post: ALL, recognition: RWA, vacation: RWA, payslip: RWA, onboarding: ALL, survey: ALL, directory: ALL },
    latitud:   { article: ALL, sponsor: ALL, interview: ALL, newsletter: ALL, stream: ALL },
  },

  product_admin: {
    minera360: { daily_report: ALL, incident: ALL, investigation: ALL, permit: ALL, ppe: ALL, inspection: ALL, report: ALL },
    contacto:  { post: ALL, recognition: ALL, vacation: ALL, payslip: ALL, onboarding: ALL, survey: ALL, directory: RW },
    latitud:   { article: ALL, sponsor: ALL, interview: ALL, newsletter: ALL, stream: ALL },
  },

  manager: {
    minera360: { daily_report: RWA, incident: RWA, investigation: RWA, permit: RWA, ppe: RW, inspection: RWA, report: R },
    contacto:  { post: RW, recognition: RW, vacation: RWA, payslip: R, directory: R, survey: R },
  },

  supervisor: {
    minera360: { daily_report: RW, incident: RW, investigation: R, permit: RW, ppe: RW, inspection: RW, report: R },
    contacto:  { post: RW, recognition: RW, vacation: R, directory: R },
  },

  operator: {
    minera360: { daily_report: R, incident: RW, permit: R, ppe: R, inspection: R },
    contacto:  { post: R, recognition: RW, vacation: RW, payslip: R, directory: R },
  },

  auditor: {
    minera360: { daily_report: R, incident: R, investigation: R, permit: R, ppe: R, inspection: R, report: R },
    contacto:  { post: R, directory: R },
    latitud:   { article: R, sponsor: R, interview: R },
  },

  external_journalist: {
    latitud: { article: RW, interview: RW, newsletter: R },
  },
};

export function can(
  role: Role | undefined | null,
  product: Product,
  module: Module,
  action: Action,
): boolean {
  if (!role) return false;
  if (role === "super_admin") return true;
  return matrix[role]?.[product]?.[module]?.includes(action) ?? false;
}

export function canAny(
  role: Role | undefined | null,
  product: Product,
  module: Module,
  actions: Action[],
): boolean {
  return actions.some((a) => can(role, product, module, a));
}

/** Para UI: lista de productos a los que el rol tiene algún acceso */
export function accessibleProducts(role: Role | undefined | null): Product[] {
  if (!role) return [];
  if (role === "super_admin") return ["minera360", "contacto", "latitud", "toori"];
  const products: Product[] = [];
  const cfg = matrix[role] ?? {};
  for (const p of Object.keys(cfg) as Product[]) {
    if (Object.keys(cfg[p] ?? {}).length > 0) products.push(p);
  }
  return products;
}
