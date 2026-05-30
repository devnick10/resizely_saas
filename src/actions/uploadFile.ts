"use server";
import { v2 } from "cloudinary";
import prisma from "@/db";
import { getUser } from "../lib/data/user/getUser";
import { revalidateTag } from "next/cache";
import { getCloudinaryPath } from "@/helper/getCloudPath";
import { UploadFilePaylolad, UploadFileResult } from "@/types";

// Configure Cloudinary
v2.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface CloudinaryUploadResult {
  public_id: string;
  bytes?: number;
  duration?: number;
  [key: string]: unknown;
}

export async function uploadFile(
  data: UploadFilePaylolad,
): Promise<UploadFileResult> {
  try {
    const user = await getUser();

    if (
      !process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      return {
        success: false,
        error: "Cloudinary credentials not found.",
      };
    }

    const bytes = await data.file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await new Promise<CloudinaryUploadResult>(
      (resolve, reject) => {
        const uploadStream = v2.uploader.upload_stream(
          {
            resource_type: data.type,
            folder: getCloudinaryPath(data.type),
            transformation:
              data.type === "video"
                ? [{ quality: "auto", fetch_format: "mp4" }]
                : [],
          },
          (error, result) => {
            if (error || !result) {
              reject(error ?? new Error("Upload failed"));
              return;
            }

            resolve(result as CloudinaryUploadResult);
          },
        );

        uploadStream.end(buffer);
      },
    );

    if (data.type === "video") {
      try {
        const remainingCredits = await prisma.$transaction(async (txn) => {
          const credit = await txn.credit.findUnique({
            where: { userId: user.id },
          });

          if (!credit || credit.credits <= 0) {
            throw new Error("Insufficient credits");
          }

          await txn.video.create({
            data: {
              title: data.title,
              description: data.description,
              publicId: result.public_id,
              originalSize: data.originalSize,
              compressSize: String(result.bytes),
              duration: result.duration ?? 0,
              userId: user.id,
            },
          });

          const creadit = await txn.credit.update({
            where: { userId: user.id },
            data: {
              credits: {
                decrement: 1,
              },
            },
          });
          return credit.credits;
        });

        revalidateTag(`videos_${user.id}`);
        revalidateTag(`credits_${user.id}`);

        return {
          success: true,
          publicId: result.public_id,
          remainingCredits,
        };
      } catch (error) {
        console.error("Video transaction failed:", error);

        if (result.public_id) {
          try {
            await v2.uploader.destroy(result.public_id);
          } catch (cleanupError) {
            console.error("Video cleanup failed:", cleanupError);
          }
        }

        return {
          success: false,
          error:
            error instanceof Error ? error.message : "Failed to upload video.",
        };
      }
    }

    if (data.type === "image") {
      try {
        const remainingCredits = await prisma.$transaction(async (txn) => {
          const credit = await txn.credit.findUnique({
            where: { userId: user.id },
          });

          if (!credit || credit.credits <= 0) {
            throw new Error("Insufficient credits");
          }

          const updatedCredit = await txn.credit.update({
            where: {
              userId: user.id,
            },
            data: {
              credits: {
                decrement: 1,
              },
            },
          });
          return updatedCredit.credits;
        });

        revalidateTag(`credits_${user.id}`);

        return {
          success: true,
          publicId: result.public_id,
          remainingCredits,
        };
      } catch (error) {
        console.error("Image transaction failed:", error);

        if (result.public_id) {
          try {
            await v2.uploader.destroy(result.public_id);
          } catch (cleanupError) {
            console.error("Image cleanup failed:", cleanupError);
          }
        }

        return {
          success: false,
          error:
            error instanceof Error ? error.message : "Failed to upload image.",
        };
      }
    }

    return {
      success: false,
      error: "Unsupported file type.",
    };
  } catch (error) {
    console.error("Upload failed:", error);

    return {
      success: false,
      error: error instanceof Error ? error.message : "Internal server error.",
    };
  }
}
