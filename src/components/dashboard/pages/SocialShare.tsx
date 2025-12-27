"use client";

import { Loader } from "@/components/core/Loader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { socialFormats } from "@/constants";
import { throwClientError } from "@/helper/clientError";
import { downloadFile } from "@/helper/downloadFile";
import { useImageUpload } from "@/hooks/useImageUpload";
import { useCreditsStore } from "@/stores/hooks";
import { CldImage } from "next-cloudinary";
import React, { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

type SocialFormat = keyof typeof socialFormats;

export const SocialShare: React.FC = () => {
  const { error, isUploading, uploadImage } = useImageUpload();
  const { credits } = useCreditsStore((state) => state);

  const [uploadedImage, setUploadedImage] = useState<string>("");
  const [selectedFormat, setSelectedFormat] = useState<SocialFormat>(
    "instagram Square (1:1)",
  );
  const [fileName, setFileName] = useState<string>("");
  const [isTransforming, setIsTransforming] = useState<boolean>(false);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (uploadedImage) setIsTransforming(true);
    if (error) {
      throwClientError(error);
    }
  }, [selectedFormat, uploadedImage, error]);

  const handleSubmit = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const file = e.target.files?.[0];
    if (!file) {
      toast.error("Please select the file.");
      return;
    }

    if (!credits || credits <= 0) {
      toast.error("Insufficient credits, please buy more.");
      return;
    }

    try {
      const response = await uploadImage(file);
      setUploadedImage(response.publicId!);
      setFileName(file.name);
      toast.success("Image uploaded successfully!");
    } catch (error: unknown) {
      throwClientError(error, "Failed to upload image.");
    }
  };

  const handleDownload = useCallback(async () => {
    if (!imageRef.current) {
      toast.error("Something went wrong.");
      return;
    }

    try {
      await downloadFile({
        url: imageRef.current.src,
        filename: `resizely_${fileName}`,
      });
      imageRef.current = null;
    } catch (error) {
      throwClientError(error, "Failed to download image.");
    }
  }, [fileName]);

  return (
    <div className="mx-auto max-w-4xl p-4">
      <h1 className="mb-2 text-center text-2xl font-bold sm:text-3xl">
        Social Media Image Creator
      </h1>
      <p className="mb-6 text-center text-muted-foreground">
        Resize your photos for any social media platform with AI-powered content
        awareness.
      </p>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Upload an Image</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="file">Choose an image file</Label>
            <Input type="file" id="file" onChange={handleSubmit} />
          </div>

          {isUploading && (
            <div className="flex w-full justify-center">
              <Loader label="Uploading" />
            </div>
          )}

          {uploadedImage && (
            <div className="space-y-6">
              <div>
                <Label htmlFor="format">Select Social Media Format</Label>
                <Select
                  value={selectedFormat}
                  onValueChange={(val) =>
                    setSelectedFormat(val as SocialFormat)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a format" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(socialFormats).map((format) => (
                      <SelectItem key={format} value={format}>
                        {format}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="relative">
                <h3 className="mb-2 text-lg font-semibold">Preview:</h3>
                <div className="flex justify-center">
                  {isTransforming && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/70">
                      <span className="h-6 w-6 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></span>
                    </div>
                  )}
                  <CldImage
                    width={socialFormats[selectedFormat].width}
                    height={socialFormats[selectedFormat].height}
                    src={uploadedImage}
                    sizes="100vw"
                    alt="transformed image"
                    crop="fill"
                    aspectRatio={socialFormats[selectedFormat].aspectRatio}
                    gravity="auto"
                    ref={imageRef}
                    onLoad={() => setIsTransforming(false)}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleDownload}>
                  Download for {selectedFormat}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
