type GetCloudinaryPath = "video" | "image";

export function getCloudinaryPath(data: GetCloudinaryPath) {
  if (data === "image") {
    return "cloudinary_saas/resize";
  } else if (data === "video") {
    return "cloudinary_saas/compress_videos";
  }
}
