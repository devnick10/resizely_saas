import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface CloudinaryUploadResult {
  public_id: string;
  bytes: number;
  duration?: number;
  [key: string]: any;
}


export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    // Validate user authentication
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Validate Cloudinary credentials
    if (
      !process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      return NextResponse.json(
        { error: "Cloudinary credentials not found." },
        { status: 500 }
      );
    }

    // Parse form data
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const originalSize = formData.get("originalSize") as string;

    // Validate file
    if (!file) {
      return NextResponse.json(
        { error: "Invalid or missing video file." },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const result = await new Promise<CloudinaryUploadResult>(
      (resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
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



    // Save video metadata to Prisma
    const video = await prisma.video.create({
      data: {
        title,
        description,
        publicId: result.public_id,
        originalSize,
        compressSize: String(result.bytes),
        duration: result.duration || 0,
      },
    });
  
    return NextResponse.json({video}, { status: 200 });

  } catch (error) {
    return NextResponse.json(
      { error: "Error while uploading video" ,error},
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}