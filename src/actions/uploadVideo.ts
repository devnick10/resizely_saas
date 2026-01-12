"use server";
import { v2 } from "cloudinary";
import prisma from "@/db";
import { getUser } from "../lib/data/user/getUser";
import { revalidateTag } from "next/cache";

// Configure Cloudinary
v2.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface CloudinaryUploadResult {
  public_id: string;
  bytes: number;
  duration?: number;
  [key: string]: unknown;
}

export async function videoUploader(data: FormData) {
  const user = await getUser();
  // Validate Cloudinary credentials
  if (
    !process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  ) {
    return { success: false, error: "Cloudinary credentials not found." };
  }

  // Parse form data
  const file = data.get("file") as File | null;
  const title = data.get("title") as string;
  const description = data.get("description") as string;
  const originalSize = data.get("originalSize") as string;

  // Validate file
  if (!file) {
    return { success: false, error: "Invalid or missing video file." };
  }

  // Convert file to buffer
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Upload to Cloudinary
  try {
    const result = await new Promise<CloudinaryUploadResult>(
      (resolve, reject) => {
        const uploadStream = v2.uploader.upload_stream(
          {
            resource_type: "video",
            folder: "cloudinary_saas/compress_videos",
            transformation: [{ quality: "auto", fetch_format: "mp4" }],
          },
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

    // Save video details to the database
    let video;
    try {
      video = await prisma.$transaction(async (txn) => {
        // Check credits
        const credit = await txn.credit.findUnique({
          where: { userId: user.id },
        });

        if (!credit || credit.credits <= 0) {
          throw new Error("Insufficient credits");
        }

        // save video in db
        const createdVideo = await txn.video.create({
          data: {
            title,
            description,
            publicId: result.public_id,
            originalSize,
            compressSize: String(result.bytes),
            duration: result.duration ?? 0,
            userId: user.id!,
          },
        });

        // decrement credit
        await txn.credit.update({
          where: { userId: user.id! },
          data: {
            credits: {
              decrement: 1,
            },
          },
        });

        return createdVideo;
      });

      revalidateTag(`videos_${user.id}`);
      revalidateTag(`credits_${user.id}`);
      return { success: true, video };
    } catch (error) {
      console.error("Video upload failed:", error);
      // cleanup cloud asset
      if (result?.public_id) {
        try {
          await v2.uploader.destroy(result.public_id);
        } catch (cleanupError) {
          console.error("Failed to delete video:", cleanupError);
        }
      }
      throw error;
    }
  } catch (error) {
    console.error("Video upload failed", error);
    throw new Error("Video upload failed");
  }
}
