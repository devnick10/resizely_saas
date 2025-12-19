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
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-center">
        AI Background Remover
      </h1>
      <p className="text-center text-muted-foreground mb-6 sm:text-lg">
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
};
