"use client";

import { videoUploader } from "@/actions/uploadVideo";
import { VideoUploadPayload } from "@/types";
import { useState } from "react";
import { useLoading } from "./useLoading";
const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

export function useVideoUpload() {
  const { loading, setLoading } = useLoading();
  const [error, setError] = useState<Error | null>(null);

  const uploadVideo = async ({
    file,
    title,
    description,
  }: VideoUploadPayload) => {
    if (!file) {
      throw new Error("No file selected");
    }

    if (MAX_FILE_SIZE < file.size) {
      throw new Error("File size too large, we support only 100mb now");
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", title);
      formData.append("description", description);
      formData.append("originalSize", file.size.toString());

      return await videoUploader(formData);
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    uploadVideo,
    isUploading: loading,
    error,
  };
}
