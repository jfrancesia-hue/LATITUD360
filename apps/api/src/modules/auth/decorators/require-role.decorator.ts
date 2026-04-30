import { SetMetadata } from "@nestjs/common";
import type { Role } from "@latitud360/database";

export const ROLES_KEY = "roles";

/**
 * @RequireRole("org_admin", "manager") — used by RolesGuard to enforce RBAC.
 */
export const RequireRole = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
