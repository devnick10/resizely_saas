"use server";
import prisma from "@/db";
import { throwServerError } from "@/helper/serverError";
import { getUser } from "@/lib/data/user/getUser";
import { v2 } from "cloudinary";
import { revalidateTag } from "next/cache";

v2.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface CloudinaryUploadResult {
  public_id: string;
  [key: string]: unknown;
}

export async function imageUploader(request: FormData) {
  const user = await getUser();

  const formData = request;
  const file = formData.get("file") as File | null;

  if (!file) {
    return { success: false, error: "File not found." };
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  try {
    const uploadResult = await new Promise<CloudinaryUploadResult>(
      (resolve, reject) => {
        const uploadStream = v2.uploader.upload_stream(
          { folder: "cloudinary_saas" },
          (error, result) => {
            if (error || !result) {
              reject(error || new Error("Upload failed"));
            } else {
              resolve(result as CloudinaryUploadResult);
            }
          },
        );

        uploadStream.end(buffer);
      },
    );

    try {
      await prisma.credit.update({
        where: {
          userId: user.id,
        },
        data: {
          credits: {
            decrement: 1,
          },
        },
      });
    } catch (error) {
      if (uploadResult?.public_id) {
        try {
          await v2.uploader.destroy(uploadResult.public_id);
        } catch (cleanupError) {
          console.error("Failed to delete image:", cleanupError);
        }
      }
      throw error;
    }

    revalidateTag(`credits_${user.id}`);
    return { success: true, publicId: uploadResult.public_id };
  } catch (error) {
    throwServerError(error, "Error while uploading image try again later.");
  }
}
