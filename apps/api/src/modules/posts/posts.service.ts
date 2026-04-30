import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import type { PostCreate, RecognitionCreate } from "@latitud360/shared";

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  feed(organizationId: string) {
    return this.prisma.client.post.findMany({
      where: { organizationId, publishedAt: { not: null } },
      orderBy: [{ pinned: "desc" }, { publishedAt: "desc" }],
      take: 50,
      include: {
        author: { select: { id: true, fullName: true, avatarUrl: true, jobTitle: true } },
        _count: { select: { reactions: true, comments: true, reads: true } },
      },
    });
  }

  create(organizationId: string, authorId: string, data: PostCreate) {
    return this.prisma.client.post.create({
      data: {
        ...data,
        organizationId,
        authorId,
        publishedAt: data.publishedAt ? new Date(data.publishedAt) : new Date(),
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
      },
    });
  }

  ack(postId: string, userId: string) {
    return this.prisma.client.postRead.upsert({
      where: { postId_userId: { postId, userId } },
      update: { acknowledged: true },
      create: { postId, userId, acknowledged: true },
    });
  }

  react(postId: string, userId: string, type: "like" | "applause" | "heart" | "idea") {
    return this.prisma.client.reaction.upsert({
      where: { postId_userId: { postId, userId } },
      update: { type },
      create: { postId, userId, type },
    });
  }

  recognize(organizationId: string, fromUserId: string, data: RecognitionCreate) {
    return this.prisma.client.recognition.create({
      data: {
        organizationId,
        fromUserId,
        toUserId: data.toUserId,
        value: data.value,
        message: data.message,
        isPublic: data.isPublic,
        photoUrl: data.photoUrl ?? null,
      },
    });
  }
}
