import "server-only";

import prisma from "@/db";
import { getAdmin } from "./getAdmin";

export type AdminMediaRow = {
  id: string;
  type: "IMAGE" | "VIDEO";
  publicId: string;
  owner: {
    id: string;
    username: string;
    email: string;
  };
  createdAt: Date;
};

export async function getAdminMedia() {
  await getAdmin();
  const [images, videos] = await prisma.$transaction([
    prisma.image.findMany({
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),

    prisma.video.findMany({
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return [
    ...images.map(
      (img): AdminMediaRow => ({
        id: img.id,
        type: "IMAGE",
        publicId: img.publicId,
        owner: img.user,
        createdAt: img.createdAt,
      }),
    ),
    ...videos.map(
      (vid): AdminMediaRow => ({
        id: vid.id,
        type: "VIDEO",
        publicId: vid.publicId,
        owner: vid.user,
        createdAt: vid.createdAt,
      }),
    ),
  ].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}
