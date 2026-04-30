import { createParamDecorator, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import type { Request } from "express";

/**
 * @CurrentTenant() — extrae { organizationId, userId, role } del header
 * "x-tenant-context" inyectado por el AuthGuard (cuando se implemente).
 *
 * Por ahora, en dev, lee también `x-organization-id` y `x-user-id` directos.
 */
export const CurrentTenant = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest<Request>();
    const orgId = req.headers["x-organization-id"] as string | undefined;
    const userId = req.headers["x-user-id"] as string | undefined;
    const role = (req.headers["x-user-role"] as string | undefined) ?? "operator";

    if (!orgId || !userId) {
      throw new UnauthorizedException("Falta tenant context (x-organization-id, x-user-id)");
    }
    return { organizationId: orgId, userId, role };
  },
);
