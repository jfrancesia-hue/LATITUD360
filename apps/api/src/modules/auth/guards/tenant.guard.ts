import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from "@nestjs/common";
import type { Request } from "express";
import type { SessionUser } from "@latitud360/auth";

/**
 * TenantGuard — verifies the user's organization matches the subdomain tenant.
 * Reads x-tenant-slug header (set by reverse proxy or frontend).
 * super_admin bypasses this check.
 */
@Injectable()
export class TenantGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request & { user?: SessionUser }>();
    const user = req.user;
    if (!user) return false;

    // super_admin can access any tenant
    if (user.role === "super_admin") return true;

    const tenantSlug = req.headers["x-tenant-slug"] as string | undefined;
    if (!tenantSlug) return true; // no tenant enforcement without header

    if (user.organizationSlug !== tenantSlug) {
      throw new ForbiddenException("Token does not belong to this tenant");
    }

    return true;
  }
}
