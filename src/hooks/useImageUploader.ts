"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { imageUpload } from "@/actions/imageUpload";
import { updateCredits } from "@/actions/updateCredits";
import { useCreditsStore } from "@/stores/hooks";

export function useImageUpload() {
  const { credits, setCredits } = useCreditsStore((state) => state);

  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isTransforming, setIsTransforming] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const imageRef = useRef<HTMLImageElement>(null);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!credits || credits <= 0) {
      toast.error("Insufficient credits. Please buy more.");
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await imageUpload(formData);

      if (!response?.success || !response.publicId) {
        throw new Error("Image upload failed");
      }

      setOriginalImage(URL.createObjectURL(file));
      setUploadedImage(response.publicId);

      toast.success("Image uploaded successfully");
    } catch (err) {
      setError(err);
      toast.error("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = useCallback(async () => {
    if (!imageRef.current) return;

    try {
      const response = await fetch(imageRef.current.src);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "image.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);

      const data = await updateCredits();
      if ("credits" in data) {
        setCredits(data.credits);
      }
    } catch (err) {
      setError(err);
      toast.error("Failed to download image. Please try again.");
    }
  }, [setCredits]);

  useEffect(() => {
    if (uploadedImage) setIsTransforming(true);

    return () => {
      if (originalImage) {
        URL.revokeObjectURL(originalImage);
      }
    };
  }, [uploadedImage, originalImage]);

  return {
    uploadedImage,
    originalImage,
    isUploading,
    isTransforming,
    imageRef,
    handleFileUpload,
    handleDownload,
    setIsTransforming,
    error,
  };
}
