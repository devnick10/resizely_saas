"use server";

import prisma from "@/db";
import { throwServerError } from "@/helper/serverError";
import { getUser } from "@/lib/data/user/getUser";
import { DeleteImagePayload, deleteImageValidatation } from "@/schema";
import { v2 } from "cloudinary";
import { revalidateTag } from "next/cache";

v2.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function deleteImage(payload: DeleteImagePayload) {
  const user = await getUser();
  const { public_id } = deleteImageValidatation(payload);

  try {
    const response = await v2.uploader.destroy(public_id, {
      resource_type: "image",
    });

    if (response.result !== "ok" && response.result !== "not found") {
      throw new Error(`Cloudinary delete failed: ${response.result}`);
    }

    await prisma.$transaction(async (txn) => {
      const transformed = await txn.transformedImage.findFirst({
        where: {
          publicId: public_id,
          image: { userId: user.id },
        },
        include: { image: true },
      });

      if (!transformed) return;

      await txn.transformedImage.delete({
        where: { id: transformed.id },
      });

      const remaining = await txn.transformedImage.count({
        where: { imageId: transformed.imageId },
      });

      if (remaining === 0) {
        await txn.image.delete({
          where: { id: transformed.imageId },
        });
      }
    });

    revalidateTag(`images_${user.id}`);
  } catch (error) {
    throwServerError(error, "Image deletion failed.");
  }
}
