import "server-only";
import prisma from "@/db";
import { unstable_cache } from "next/cache";
import { getUser } from "./user/getUser";

export async function getVideos() {
  const user = await getUser();

  const cachedGetVideos = unstable_cache(
    async () => {
      return prisma.video.findMany({
        where: {
          userId: user.id,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    },
    [`videos_${user.id}`], // cache key
    {
      tags: [`videos_${user.id}`], // revalidation tag
    },
  );

  return cachedGetVideos();
}
