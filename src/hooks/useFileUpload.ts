"use client";

import { uploadFile } from "@/actions/uploadFile";
import { UploadFilePaylolad, UploadFileResult } from "@/types";
import { useLoading } from "./useLoading";

export function useFileUpload() {
  const { loading, setLoading } = useLoading();

  const handleFileUpload = async (
    data: UploadFilePaylolad,
  ): Promise<UploadFileResult> => {
    if (!data.file) {
      return {
        success: false,
        error: "File is required.",
      };
    }

    setLoading(true);

    try {
      return await uploadFile(data);
    } finally {
      setLoading(false);
    }
  };

  return {
    handleFileUpload,
    isUploading: loading,
  };
}
