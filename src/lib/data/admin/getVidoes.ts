import prisma from "@/db";
import { getAdmin } from "./getAdmin";
import "server-only";
export type AdminVideoRow = {
  id: string;
  title: string;
  publicId: string;
  owner: {
    id: string;
    username: string;
    email: string;
  };
  originalSize: string;
  compressSize: string;
  duration: number;
  createdAt: Date;
};

export async function getAdminVideos() {
  await getAdmin();
  const videos = await prisma.video.findMany({
    include: {
      user: {
        select: {
          id: true,
          username: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return videos.map(
    (video): AdminVideoRow => ({
      id: video.id,
      title: video.title,
      publicId: video.publicId,
      owner: video.user,
      originalSize: video.originalSize,
      compressSize: video.compressSize,
      duration: video.duration,
      createdAt: video.createdAt,
    }),
  );
}
