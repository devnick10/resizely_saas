import prisma from "@/db";
import { v2 } from "cloudinary";
import { getAdmin } from "./getAdmin";

v2.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function deleteUserWithAssets(userId: string) {
  const admin = await getAdmin();
  if (admin.id === userId) {
    throw new Error("Admin cannot delete themselves");
  }

  //  Fetch assets first
  const [images, videos] = await prisma.$transaction([
    prisma.image.findMany({
      where: { userId },
      select: { publicId: true },
    }),
    prisma.video.findMany({
      where: { userId },
      select: { publicId: true },
    }),
  ]);

  // Delete Cloudinary assets
  await Promise.allSettled([
    ...images.map((img) => v2.uploader.destroy(img.publicId)),
    ...videos.map((vid) =>
      v2.uploader.destroy(vid.publicId, {
        resource_type: "video",
      }),
    ),
  ]);

  await prisma.$transaction(async (txn) => {
    //  Delete user (CASCADE handles DB cleanup)
    await txn.user.delete({
      where: { id: userId },
    });

    //  Audit log (optional but recommended)
    await txn.auditLog.create({
      data: {
        adminId: admin.id,
        action: "USER_DELETE",
        targetId: userId,
        meta: {
          imagesDeleted: images.length,
          videosDeleted: videos.length,
        },
      },
    });
  });

  return { success: true };
}
