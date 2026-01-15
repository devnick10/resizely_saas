import "server-only";
import prisma from "@/db";
import { v2 } from "cloudinary";
import { getAdmin } from "./getAdmin";

v2.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function getStorageAnalytics() {
  await getAdmin();
  const usage = await v2.api.usage();

  const [users, images, videos, derived, irreversible] =
    await prisma.$transaction([
      prisma.user.count(),
      prisma.image.count(),
      prisma.video.count(),
      prisma.transformedImage.count({ where: { type: "DERIVED" } }),
      prisma.transformedImage.count({ where: { type: "IRREVERSIBLE" } }),
    ]);

  return {
    cloudinary: {
      plan: usage.plan,
      storageMB: Math.round(usage.storage.usage / 1024 / 1024),
      bandwidthMB: Math.round(usage.bandwidth.usage / 1024 / 1024),
      totalAssets: usage.resources,
      derivedAssets: usage.derived_resources,
      transformations: usage.transformations.usage,
      aiUsed: usage.cloudinary_ai?.usage ?? 0,
      aiLimit: usage.cloudinary_ai?.limit ?? 0,
      creditsUsed: usage.credits.usage,
      creditsLimit: usage.credits.limit,
    },
    database: {
      users,
      images,
      videos,
      derived,
      irreversible,
    },
  };
}
