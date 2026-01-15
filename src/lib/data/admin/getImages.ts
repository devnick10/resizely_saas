import prisma from "@/db";
import { getAdmin } from "./getAdmin";
import "server-only";

export type AdminImageRow = {
  id: string;
  publicId: string;
  owner: {
    id: string;
    username: string;
    email: string;
  };
  transformationsCount: number;
  createdAt: Date;
};

export async function getAdminImages() {
  await getAdmin();

  const images = await prisma.image.findMany({
    include: {
      user: {
        select: {
          id: true,
          username: true,
          email: true,
        },
      },
      _count: {
        select: {
          transformations: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return images.map(
    (img): AdminImageRow => ({
      id: img.id,
      publicId: img.publicId,
      owner: img.user,
      transformationsCount: img._count.transformations,
      createdAt: img.createdAt,
    }),
  );
}
