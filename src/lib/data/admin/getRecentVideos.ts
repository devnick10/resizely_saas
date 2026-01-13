import "server-only";
import prisma from "@/db";
import { getAdmin } from "./getAdmin";

export async function getRecentVideos(limit = 10) {
  await getAdmin();

  return prisma.video.findMany({
    take: limit,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      publicId: true,
      originalSize: true,
      compressSize: true,
      duration: true,
      createdAt: true,
      user: {
        select: {
          email: true,
          username: true,
        },
      },
    },
  });
}
