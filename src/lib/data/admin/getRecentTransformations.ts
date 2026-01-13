import "server-only";
import prisma from "@/db";
import { getAdmin } from "./getAdmin";

export async function getRecentTransformations(limit = 10) {
  await getAdmin();

  return prisma.transformedImage.findMany({
    take: limit,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      publicId: true,
      type: true,
      createdAt: true,
      image: {
        select: {
          publicId: true,
          user: {
            select: {
              email: true,
              username: true,
            },
          },
        },
      },
    },
  });
}
