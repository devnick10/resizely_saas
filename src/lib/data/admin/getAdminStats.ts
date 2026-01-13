import prisma from "@/db";
import { throwServerError } from "@/helper/serverError";
import { unstable_cache } from "next/cache";
import "server-only";
import { getAdmin } from "./getAdmin";

export const getAdminStats = async () => {
  const admin = await getAdmin();

  const cachedCredits = unstable_cache(
    async () => {
      try {
        const [
          totalUsers,
          totalImages,
          totalVideos,
          totalTransformations,
          totalAdmins,
        ] = await Promise.all([
          prisma.user.count(),
          prisma.image.count(),
          prisma.video.count(),
          prisma.transformedImage.count(),
          prisma.user.count({
            where: { role: "ADMIN" },
          }),
        ]);

        return {
          totalUsers,
          totalImages,
          totalVideos,
          totalTransformations,
          totalAdmins,
        };
      } catch (error) {
        throwServerError(error, "Failed to fetch users");
      }
    },
    [`${admin.id}`],
    {
      tags: [`credits_${admin.id}`],
    },
  );
  return cachedCredits();
};
