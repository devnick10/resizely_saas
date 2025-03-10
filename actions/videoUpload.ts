"use server";
import { v2 } from "cloudinary";
import prisma from "@/db";
import { auth } from "@clerk/nextjs/server";

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

export async function videoUpload(data: FormData) {
  try {

    const { userId } = await auth()

    if (!userId) {
      return { success: false, error: "Unauthorize" };
    }

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
    const result = await new Promise<CloudinaryUploadResult>(
      (resolve, reject) => {
        const uploadStream = v2.uploader.upload_stream(
          {
            resource_type: "video",
            folder: "cloudinary_saas_videos",
            transformation: [{ quality: "auto", fetch_format: "mp4" }],
          },
          (error, result) => {
            if (error || !result) {
              reject(error || new Error("Upload failed"));
            } else {
              resolve(result as CloudinaryUploadResult);
            }
          }
        );
        uploadStream.end(buffer);
      }
    );

    // Save video details to the database
    const video = await prisma.video.create({
      data: {
        title,
        description,
        publicId: result.public_id,
        originalSize,
        compressSize: String(result.bytes),
        duration: result.duration || 0,
        userId,
      },
    });

    return { success: true, video };
  } catch (error) {
    return { error, success: false, message: "Error while uploading video" };
  }
}