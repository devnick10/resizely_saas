"use client";

import { imageUpload } from "@/actions/imageUpload";
import { updateCredits } from "@/actions/updateCredits";
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
import { CldImage } from "next-cloudinary";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useCreditsStore } from "@/stores/hooks";
import { socialFormats } from "@/constants";

type SocialFormat = keyof typeof socialFormats;

export const SocialShare: React.FC = () => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<SocialFormat>(
    "instagram Square (1:1)",
  );
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isTransforming, setIsTransforming] = useState<boolean>(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const { credits, setCredits } = useCreditsStore((state) => state);
  const router = useRouter();

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      if (!credits) {
        toast.error("Insufficient credits, please buy more.");
        return;
      }

      const response = await imageUpload(formData);
      if (!response.success) throw new Error("Failed to upload image");
      if (response.publicId) {
        setUploadedImage(response.publicId);
      }
      toast.success("Image uploaded successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to upload image.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = useCallback(async () => {
    if (!imageRef.current) return;

    try {
      await downloadImage(imageRef.current.src);

      const data = await updateCredits();
      if ("credits" in data) {
        setCredits(data.credits);
        router.push("/social-share");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to download image.");
    }
  }, [setCredits, router]);

  const downloadImage = async (imageSrc: string) => {
    try {
      const response = await fetch(imageSrc);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "image.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      toast.error("Failed to download image.");
    }
  };

  useEffect(() => {
    if (uploadedImage) setIsTransforming(true);
  }, [selectedFormat, uploadedImage]);

  return (
    <div className=" max-w-4xl mx-auto p-4">
      <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-center">
        Social Media Image Creator
      </h1>
      <p className="text-center text-muted-foreground mb-6">
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
            <Input type="file" id="file" onChange={handleFileUpload} />
          </div>

          {isUploading && (
            <div className="animate-pulse text-sm">Uploading...</div>
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
                <h3 className="text-lg font-semibold mb-2">Preview:</h3>
                <div className="flex justify-center">
                  {isTransforming && (
                    <div className="absolute inset-0 flex items-center justify-center bg-background/70 z-10">
                      <span className="animate-spin w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full"></span>
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
