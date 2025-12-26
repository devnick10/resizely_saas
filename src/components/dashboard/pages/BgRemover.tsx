"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useImageUpload } from "@/hooks/useImageUploader";
import { CldImage } from "next-cloudinary";
import Image from "next/image";
import toast from "react-hot-toast";

export const BgRemover: React.FC = () => {
  const {
    uploadedImage,
    originalImage,
    isUploading,
    isTransforming,
    imageRef,
    handleFileUpload,
    handleDownload,
    error,
    setIsTransforming,
  } = useImageUpload();

  if (error) toast.error("Something went wrong");

  return (
    <div className="container mx-auto max-w-4xl p-4">
      <h1 className="mb-4 text-center text-2xl font-bold sm:text-3xl">
        AI Background Remover
      </h1>
      <p className="mb-6 text-center text-muted-foreground sm:text-lg">
        Upload an image and let AI remove the background. Download the final
        result instantly!
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

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg border bg-muted p-2">
                  <Image
                    src={originalImage}
                    alt="Original"
                    width={400}
                    height={400}
                    className="mx-auto rounded-lg"
                  />
                </div>
                <div className="relative rounded-lg border bg-muted p-2">
                  {isTransforming && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-white/60">
                      <span className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></span>
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
                    className="mx-auto rounded-lg"
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
};
