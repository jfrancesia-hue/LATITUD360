import type { Role, User, Organization } from "@latitud360/database";

export interface SessionUser {
  id: string;
  authId: string;
  email: string;
  fullName: string;
  role: Role;
  organizationId: string;
  organizationSlug: string;
  avatarUrl?: string | null;
}

export interface AuthSession {
  user: SessionUser;
  organization: Organization;
}

export type FullUserWithOrg = User & { organization: Organization };
