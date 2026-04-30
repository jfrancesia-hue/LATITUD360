import { Injectable, ConflictException, NotFoundException, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { getSupabaseAdminClient } from "@latitud360/auth";
import type { OrgCreate, UserInvite } from "@latitud360/shared";

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  /** Returns the current user profile + organization */
  async getMe(userId: string) {
    const user = await this.prisma.client.user.findUnique({
      where: { id: userId },
      include: {
        organization: true,
        productAccess: true,
      },
    });
    if (!user) throw new NotFoundException("User not found");
    return user;
  }

  /** org_admin invites a user: creates Supabase invite + Prisma User row */
  async inviteUser(organizationId: string, actorId: string, data: UserInvite) {
    const existing = await this.prisma.client.user.findUnique({
      where: { email: data.email },
    });
    if (existing) throw new ConflictException("Email already registered in this system");

    const supabase = getSupabaseAdminClient();
    const { data: inviteData, error } = await supabase.auth.admin.inviteUserByEmail(
      data.email,
      { data: { full_name: data.fullName } },
    );
    if (error) throw new BadRequestException(`Supabase invite error: ${error.message}`);

    const user = await this.prisma.client.user.create({
      data: {
        authId: inviteData.user.id,
        email: data.email,
        fullName: data.fullName,
        role: data.role,
        dni: data.dni ?? null,
        phone: data.phone ?? null,
        jobTitle: data.jobTitle ?? null,
        birthDate: data.birthDate ? new Date(data.birthDate as string) : null,
        hireDate: data.hireDate ? new Date(data.hireDate as string) : null,
        organizationId,
      },
    });

    await this.prisma.client.auditLog.create({
      data: {
        organizationId,
        actorId,
        action: "user.invited",
        resource: "User",
        resourceId: user.id,
        after: { email: data.email, role: data.role } as any,
      },
    });

    return user;
  }

  /** Refresh JWT via Supabase admin — returns new access + refresh tokens */
  async refreshToken(refreshToken: string) {
    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase.auth.refreshSession({ refresh_token: refreshToken });
    if (error || !data.session) {
      throw new BadRequestException("Invalid or expired refresh token");
    }
    return {
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
      expiresIn: data.session.expires_in,
    };
  }

  /**
   * super_admin creates a new organization + invites its first org_admin.
   * Wraps in a transaction so both rows land or neither does.
   */
  async createOrgWithAdmin(actorId: string, orgData: OrgCreate, adminEmail: string, adminName: string) {
    const existing = await this.prisma.client.organization.findUnique({
      where: { slug: orgData.slug },
    });
    if (existing) throw new ConflictException(`Slug '${orgData.slug}' already in use`);

    return this.prisma.client.$transaction(async (tx) => {
      const org = await tx.organization.create({
        data: {
          slug: orgData.slug,
          name: orgData.name,
          legalName: orgData.legalName ?? null,
          taxId: orgData.taxId ?? null,
          province: orgData.province ?? null,
          size: orgData.size ?? null,
        },
      });

      const supabase = getSupabaseAdminClient();
      const { data: inviteData, error } = await supabase.auth.admin.inviteUserByEmail(
        adminEmail,
        { data: { full_name: adminName } },
      );
      if (error) throw new BadRequestException(`Supabase invite error: ${error.message}`);

      const adminUser = await tx.user.create({
        data: {
          authId: inviteData.user.id,
          email: adminEmail,
          fullName: adminName,
          role: "org_admin",
          organizationId: org.id,
        },
      });

      await tx.auditLog.create({
        data: {
          organizationId: org.id,
          actorId,
          action: "organization.created",
          resource: "Organization",
          resourceId: org.id,
          after: { slug: org.slug, name: org.name, adminEmail } as any,
        },
      });

      return { organization: org, adminUser };
    });
  }
}
