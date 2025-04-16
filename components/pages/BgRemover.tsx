"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { CldImage } from "next-cloudinary";
import Image from "next/image";
import { useCreditContext } from "@/context";
import toast from "react-hot-toast";
import { getUser } from "@/actions/getUser";
import { updateCredits } from "@/actions/updateCredits";
import { imageUpload } from "@/actions/imageUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function BgRemover() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<unknown>();
  const [isTransforming, setIsTransforming] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const { credits, setCredits } = useCreditContext();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!credits || credits <= 0) {
      return toast.error("Insufficient credits. Please buy more.");
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await imageUpload(formData);
      if (!response.success) throw new Error("Image upload failed");

      if (response.publicId) {
        setOriginalImage(URL.createObjectURL(file));
        setUploadedImage(response.publicId);
      }
      toast.success("Image uploaded successfully");
    } catch (error) {
      setError(error);
      toast.error("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = useCallback(async () => {
    const { email } = await getUser();
    if (!imageRef.current || !email) return;

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
      if (data?.credits !== undefined) {
        setCredits(data.credits);
      }
    } catch (error) {
      setError(error);
      toast.error("Failed to download image. Please try again.");
    }
  }, [setCredits]);

  useEffect(() => {
    if (uploadedImage) setIsTransforming(true);
    return () => {
      if (originalImage) URL.revokeObjectURL(originalImage);
    };
  }, [originalImage, uploadedImage]);

  if (error) toast.error("Something went wrong");

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-center">
        AI Background Remover
      </h1>
      <p className="text-center text-muted-foreground mb-6 sm:text-lg">
        Upload an image and let AI remove the background. Download the final result instantly!
      </p>

      <Card>
        <CardHeader>
          <CardTitle>Upload an Image</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="file">Choose Image</Label>
            <Input
              id="file"
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              disabled={isUploading}
            />
          </div>

          {isUploading && (
            <div className="text-sm text-muted-foreground">Uploading...</div>
          )}

          {uploadedImage && originalImage && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Before & After Preview:</h3>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="border rounded-lg p-2 bg-muted">
                  <Image
                    src={originalImage}
                    alt="Original"
                    width={400}
                    height={400}
                    className="rounded-lg mx-auto"
                  />
                </div>
                <div className="border rounded-lg p-2 bg-muted relative">
                  {isTransforming && (
                    <div className="absolute inset-0 bg-white/60 flex items-center justify-center rounded-lg z-10">
                      <span className="animate-spin border-4 border-blue-500 border-t-transparent rounded-full h-10 w-10"></span>
                    </div>
                  )}
                  <CldImage
                    width={400}
                    height={400}
                    src={uploadedImage}
                    sizes="100vw"
                    alt="Transformed Image"
                    removeBackground
                    ref={imageRef}
                    onLoad={() => setIsTransforming(false)}
                    className="rounded-lg mx-auto"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleDownload}>Download</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
