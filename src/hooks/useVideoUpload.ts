"use client";

import { videoUpload } from "@/actions/videoUpload";
import { VideoUploadPayload } from "@/types";
import { useState } from "react";
const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

export function useVideoUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const uploadVideo = async ({
    file,
    title,
    description,
  }: VideoUploadPayload) => {
    if (!file) {
      throw new Error("No file selected");
    }

    if (file.size > MAX_FILE_SIZE) {
      throw new Error("File size too large, we support only 100mb now");
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", title);
      formData.append("description", description);
      formData.append("originalSize", file.size.toString());

      return await videoUpload(formData);
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    uploadVideo,
    isUploading,
    error,
  };
}
