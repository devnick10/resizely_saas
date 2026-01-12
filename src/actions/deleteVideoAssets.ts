"use server";
import prisma from "@/db";
import { throwServerError } from "@/helper/serverError";
import { deleteVideoValidatation } from "@/schema";
import { v2 } from "cloudinary";
import { getUser } from "../lib/data/user/getUser";
import { revalidateTag } from "next/cache";

// Configure Cloudinary
v2.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function deleteVideo(payload: string) {
  const user = await getUser();
  const { public_id } = deleteVideoValidatation(payload);

  // Validate Cloudinary credentials
  if (
    !process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  ) {
    throwServerError(null, "Cloudinary credentials not found.");
  }

  try {
    const response = await v2.uploader.destroy(public_id, {
      resource_type: "video",
    });

    if (response.result !== "ok" && response.result !== "not found") {
      throw new Error(`Cloudinary delete failed: ${response.result}`);
    }

    await prisma.video.deleteMany({
      where: {
        userId: user.id,
        publicId: public_id,
      },
    });
    revalidateTag(`videos_${user.id}`);
  } catch (error) {
    throwServerError(error, "Video deletion failed.");
  }
}
