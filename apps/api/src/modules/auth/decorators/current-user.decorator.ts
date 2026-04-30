import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import type { Request } from "express";
import type { SessionUser } from "@latitud360/auth";

/**
 * @CurrentUser() — extracts the SessionUser injected by JwtAuthGuard into request.user.
 */
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): SessionUser => {
    const req = ctx.switchToHttp().getRequest<Request & { user: SessionUser }>();
    return req.user;
  },
);
