import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import type { Request } from "express";
import { PrismaService } from "../../../prisma/prisma.service";
import { getSupabaseAdminClient } from "@latitud360/auth";
import type { SessionUser } from "@latitud360/auth";

/**
 * JwtAuthGuard — validates the Bearer JWT issued by Supabase Auth.
 * On success, attaches SessionUser to request.user.
 */
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request & { user?: SessionUser }>();

    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      throw new UnauthorizedException("Missing or malformed Authorization header");
    }

    const token = authHeader.slice(7);
    const supabase = getSupabaseAdminClient();

    const { data: { user: authUser }, error } = await supabase.auth.getUser(token);
    if (error || !authUser) {
      throw new UnauthorizedException("Invalid or expired token");
    }

    const dbUser = await this.prisma.client.user.findFirst({
      where: {
        OR: [
          { authId: authUser.id },
          { email: authUser.email ?? "" },
        ],
      },
      include: { organization: true },
    });

    if (!dbUser || !dbUser.isActive) {
      throw new UnauthorizedException("User not found or deactivated");
    }

    req.user = {
      id: dbUser.id,
      authId: authUser.id,
      email: dbUser.email,
      fullName: dbUser.fullName,
      role: dbUser.role,
      organizationId: dbUser.organizationId,
      organizationSlug: (dbUser as any).organization.slug,
      avatarUrl: dbUser.avatarUrl,
    };

    return true;
  }
}
