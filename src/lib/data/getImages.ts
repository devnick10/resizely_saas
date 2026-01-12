import "server-only";
import prisma from "@/db";
import { unstable_cache } from "next/cache";
import { getUser } from "./user/getUser";
import { Image, Transformation } from "@/types";

export async function getImages(): Promise<Image[]> {
  const user = await getUser();

  const cachedGetImages = unstable_cache(
    async () => {
      const images = await prisma.image.findMany({
        where: { userId: user.id },
        include: {
          transformations: {
            orderBy: { createdAt: "desc" },
          },
        },
      });

      return images.map((img) => ({
        id: img.id,
        publicId: img.publicId,
        createdAt: img.createdAt.toISOString(),
        transformations: img.transformations.map((t) => ({
          id: t.id,
          tranformedPublicId: t.publicId,
          type: t.type,
          transformation: t.transformation as Transformation,
          createdAt: t.createdAt.toISOString(),
        })),
      }));
    },
    [`images_${user.id}`],
    {
      tags: [`images_${user.id}`],
    },
  );

  return cachedGetImages();
}
