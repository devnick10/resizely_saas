"use server";

import { v2 as cloudinary } from "cloudinary";

export async function persistBgRemovedImage(url: string) {
  const result = await cloudinary.uploader.upload(url, {
    folder: "cloudinary_saas/bg_removed",
    format: "png",
  });

  return {
    publicId: result.public_id,
  };
}
