import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import type { Request } from "express";
import type { Role } from "@latitud360/database";
import type { SessionUser } from "@latitud360/auth";
import { ROLES_KEY } from "../decorators/require-role.decorator";

/**
 * RolesGuard — enforces @RequireRole(...) metadata.
 * Must run after JwtAuthGuard (needs request.user).
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // No roles required — pass through
    if (!required || required.length === 0) return true;

    const req = context.switchToHttp().getRequest<Request & { user?: SessionUser }>();
    const user = req.user;
    if (!user) return false;

    // super_admin bypasses all role checks
    if (user.role === "super_admin") return true;

    if (!required.includes(user.role as Role)) {
      throw new ForbiddenException(
        `Role '${user.role}' is not authorized. Required: [${required.join(", ")}]`,
      );
    }

    return true;
  }
}
