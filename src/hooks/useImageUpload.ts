"use client";

import { imageUploader } from "@/actions/uploadImage";
import { throwClientError } from "@/helper/clientError";
import { useState } from "react";

export function useImageUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const uploadImage = async (file: File) => {
    if (!file) throwClientError("File is required.");

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      return await imageUploader(formData);
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    uploadImage,
    isUploading,
    error,
  };
}
