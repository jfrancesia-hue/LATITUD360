import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getCurrentSession } from "@latitud360/auth/server";
import { prisma } from "@latitud360/database";
import { can } from "@latitud360/shared";

export const runtime = "nodejs";

export async function GET(
  req: NextRequest,
  { params }: { params: { postId: string } },
) {
  const session = await getCurrentSession(cookies(), req.headers.get("x-tenant-slug") ?? undefined);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!can(session.user.role, "contacto", "post", "read")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const post = await prisma.post.findFirst({
    where: { id: params.postId, organizationId: session.user.organizationId },
  });
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const filter = (post.audienceFilter ?? {}) as Record<string, unknown>;
  const audienceWhere: Record<string, unknown> =
    post.audience === "all"
      ? { organizationId: session.user.organizationId, isActive: true }
      : post.audience === "role" && typeof filter.role === "string"
        ? { organizationId: session.user.organizationId, role: filter.role, isActive: true }
        : post.audience === "custom" && Array.isArray(filter.userIds)
          ? { organizationId: session.user.organizationId, id: { in: filter.userIds as string[] }, isActive: true }
          : { organizationId: session.user.organizationId, isActive: true };

  const [audienceSize, reads, ackedCount, reactionsByType, commentsCount] = await Promise.all([
    prisma.user.count({ where: audienceWhere as any }),
    prisma.postRead.count({ where: { postId: post.id } }),
    prisma.postRead.count({ where: { postId: post.id, acknowledged: true } }),
    prisma.reaction.groupBy({
      by: ["type"],
      where: { postId: post.id },
      _count: { _all: true },
    }),
    prisma.comment.count({ where: { postId: post.id } }),
  ]);

  return NextResponse.json({
    post: {
      id: post.id,
      title: post.title,
      type: post.type,
      audience: post.audience,
      requiresAck: post.requiresAck,
      publishedAt: post.publishedAt,
    },
    audienceSize,
    reads,
    readRate: audienceSize > 0 ? +((100 * reads) / audienceSize).toFixed(1) : 0,
    acknowledged: ackedCount,
    ackRate: post.requiresAck && reads > 0 ? +((100 * ackedCount) / reads).toFixed(1) : null,
    reactions: {
      total: reactionsByType.reduce((sum, r) => sum + r._count._all, 0),
      byType: reactionsByType.map((r) => ({ type: r.type, count: r._count._all })),
    },
    comments: commentsCount,
  });
}
