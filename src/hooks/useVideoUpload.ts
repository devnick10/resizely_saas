"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { videoUpload } from "@/actions/videoUpload";
import { useCreditsStore } from "@/stores/hooks";

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

export function useVideoUpload() {
  const { credits } = useCreditsStore((state) => state);

  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const router = useRouter();

  const uploadVideo = async ({
    file,
    title,
    description,
  }: {
    file: File;
    title: string;
    description: string;
  }) => {
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      toast.error("File size too large");
      return;
    }

    if (!credits || credits <= 0) {
      toast.error("Insufficient credits, please buy more.");
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", title);
      formData.append("description", description);
      formData.append("originalSize", file.size.toString());

      const response = await videoUpload(formData);

      if (!response?.success) {
        throw new Error("Upload failed");
      }

      toast.success("Video uploaded successfully");
      router.push("/home");
    } catch (err) {
      setError(err);
      toast.error("Failed to upload video");
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
