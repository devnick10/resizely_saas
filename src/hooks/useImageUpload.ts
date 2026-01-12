"use client";

import { imageUploader } from "@/actions/uploadImage";
import { throwClientError } from "@/helper/clientError";
import { useState } from "react";
import { useLoading } from "./useLoading";

export function useImageUpload() {
  const { loading, setLoading } = useLoading();
  const [error, setError] = useState<unknown>(null);

  const uploadImage = async (file: File) => {
    if (!file) throwClientError("File is required.");

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      return await imageUploader(formData);
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    uploadImage,
    isUploading: loading,
    error,
  };
}
