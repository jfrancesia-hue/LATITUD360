import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class CommunicationStatsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Stats de un post específico: lectura, ack, reacciones, comentarios.
   * Calcula también el universo de destinatarios según audience + audienceFilter
   * para poder mostrar % de lectura real.
   */
  async post(organizationId: string, postId: string) {
    const post = await this.prisma.client.post.findFirst({
      where: { id: postId, organizationId },
    });
    if (!post) throw new NotFoundException();

    const audienceWhere = this.audienceWhere(organizationId, post.audience, post.audienceFilter);
    const [audienceSize, reads, ackedCount, reactionsByType, commentsCount] = await Promise.all([
      this.prisma.client.user.count({ where: { ...audienceWhere, isActive: true } }),
      this.prisma.client.postRead.count({ where: { postId } }),
      this.prisma.client.postRead.count({ where: { postId, acknowledged: true } }),
      this.prisma.client.reaction.groupBy({
        by: ["type"],
        where: { postId },
        _count: { _all: true },
      }),
      this.prisma.client.comment.count({ where: { postId } }),
    ]);

    return {
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
    };
  }

  /**
   * Lista quién leyó / no leyó un post (límite 500). Útil para auditoría
   * de comunicados oficiales con requiresAck.
   */
  async postReadership(organizationId: string, postId: string) {
    const post = await this.prisma.client.post.findFirst({
      where: { id: postId, organizationId },
    });
    if (!post) throw new NotFoundException();

    const audienceWhere = this.audienceWhere(organizationId, post.audience, post.audienceFilter);
    const [audience, reads] = await Promise.all([
      this.prisma.client.user.findMany({
        where: { ...audienceWhere, isActive: true },
        select: { id: true, fullName: true, avatarUrl: true, jobTitle: true },
        take: 500,
      }),
      this.prisma.client.postRead.findMany({
        where: { postId },
        select: { userId: true, readAt: true, acknowledged: true },
      }),
    ]);
    const readMap = new Map(reads.map((r) => [r.userId, r]));
    return audience.map((u) => {
      const read = readMap.get(u.id);
      return {
        ...u,
        readAt: read?.readAt ?? null,
        acknowledged: read?.acknowledged ?? false,
      };
    });
  }

  /**
   * Dashboard global de comunicaciones del tenant.
   */
  async dashboard(organizationId: string, days = 30) {
    const since = new Date();
    since.setDate(since.getDate() - days);

    const [postsTotal, postsByType, recentPosts, totalReads, totalReactions, totalRecognitions] =
      await Promise.all([
        this.prisma.client.post.count({
          where: { organizationId, publishedAt: { gte: since } },
        }),
        this.prisma.client.post.groupBy({
          by: ["type"],
          where: { organizationId, publishedAt: { gte: since } },
          _count: { _all: true },
        }),
        this.prisma.client.post.findMany({
          where: { organizationId, publishedAt: { gte: since } },
          orderBy: { publishedAt: "desc" },
          take: 5,
          include: { _count: { select: { reads: true, reactions: true, comments: true } } },
        }),
        this.prisma.client.postRead.count({
          where: { post: { organizationId, publishedAt: { gte: since } } },
        }),
        this.prisma.client.reaction.count({
          where: { post: { organizationId, publishedAt: { gte: since } } },
        }),
        this.prisma.client.recognition.count({
          where: { organizationId, createdAt: { gte: since } },
        }),
      ]);

    const activeUsers = await this.prisma.client.user.count({
      where: { organizationId, isActive: true },
    });

    return {
      window: { days, since },
      activeUsers,
      posts: {
        total: postsTotal,
        byType: postsByType.map((b) => ({ type: b.type, count: b._count._all })),
        recent: recentPosts,
      },
      engagement: {
        totalReads,
        totalReactions,
        totalRecognitions,
        readsPerUser: activeUsers > 0 ? +((totalReads / activeUsers).toFixed(2)) : 0,
        recognitionsPerUser: activeUsers > 0 ? +((totalRecognitions / activeUsers).toFixed(2)) : 0,
      },
    };
  }

  /**
   * Traduce el campo Post.audience + audienceFilter a un where para User.
   * audience = "all"     → toda la org
   * audience = "site"    → users que reportaron al menos un parte/incidente en ese site
   *                        (proxy hasta tener User.siteId formal)
   * audience = "area"    → idem proxy con areaId
   * audience = "role"    → users con un role específico
   * audience = "custom"  → audienceFilter.userIds[]
   */
  private audienceWhere(
    organizationId: string,
    audience: string,
    filter: unknown,
  ): Record<string, unknown> {
    const f = (filter ?? {}) as Record<string, unknown>;
    if (audience === "all") return { organizationId };
    if (audience === "role" && typeof f.role === "string") {
      return { organizationId, role: f.role };
    }
    if (audience === "custom" && Array.isArray(f.userIds)) {
      return { organizationId, id: { in: f.userIds as string[] } };
    }
    if (audience === "site" && typeof f.siteId === "string") {
      return {
        organizationId,
        OR: [
          { reportedDailyReports: { some: { siteId: f.siteId as string } } },
          { reportedIncidents: { some: { siteId: f.siteId as string } } },
        ],
      };
    }
    if (audience === "area" && typeof f.areaId === "string") {
      return {
        organizationId,
        OR: [
          { reportedDailyReports: { some: { areaId: f.areaId as string } } },
          { reportedIncidents: { some: { areaId: f.areaId as string } } },
        ],
      };
    }
    return { organizationId };
  }
}
