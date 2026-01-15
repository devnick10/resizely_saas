import prisma from "@/db";
import { v2 } from "cloudinary";
import { getAdmin } from "./getAdmin";

v2.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function deleteAdminMedia(
  mediaId: string,
  type: "IMAGE" | "VIDEO",
) {
  const admin = await getAdmin();

  if (!admin || admin.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  if (type === "IMAGE") {
    const image = await prisma.image.findUnique({
      where: { id: mediaId },
    });

    if (!image) throw new Error("Image not found");

    await v2.uploader.destroy(image.publicId);

    await prisma.$transaction([
      prisma.image.update({
        where: { id: mediaId },
        data: {
          deletedAt: new Date(),
          deletedBy: admin.id,
        },
      }),
      prisma.auditLog.create({
        data: {
          adminId: admin.id,
          action: "MEDIA_DELETE",
          targetId: image.id,
          meta: {
            type: "IMAGE",
            publicId: image.publicId,
          },
        },
      }),
    ]);
  }

  if (type === "VIDEO") {
    const video = await prisma.video.findUnique({
      where: { id: mediaId },
    });

    if (!video) throw new Error("Video not found");

    await v2.uploader.destroy(video.publicId, {
      resource_type: "video",
    });

    await prisma.$transaction([
      prisma.video.update({
        where: { id: mediaId },
        data: {
          deletedAt: new Date(),
          deletedBy: admin.id,
        },
      }),
      // 3. Audit log
      prisma.auditLog.create({
        data: {
          adminId: admin.id,
          action: "MEDIA_DELETE",
          targetId: video.id,
          meta: {
            type: "VIDEO",
            publicId: video.publicId,
          },
        },
      }),
    ]);
  }

  return { success: true };
}
