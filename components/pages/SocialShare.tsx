"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { CldImage } from "next-cloudinary";
import { useCreditContext } from "@/context";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { updateCredits } from "@/actions/updateCredits";
import { imageUpload } from "@/actions/imageUpload";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const socialFormats = {
  "instagram Square (1:1)": { width: 1080, height: 1080, aspectRatio: "1:1" },
  "instagram Portrait (4:5)": { width: 1080, height: 1350, aspectRatio: "4:5" },
  "twitter Post (16:9)": { width: 1200, height: 675, aspectRatio: "16:9" },
  "twitter Header (3:1)": { width: 1500, height: 500, aspectRatio: "3:1" },
  "facebook Cover (205:78)": { width: 820, height: 312, aspectRatio: "205:78" },
};

type SocialFormat = keyof typeof socialFormats;

export default function SocialShare() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<SocialFormat>(
    "instagram Square (1:1)",
  );
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isTransforming, setIsTransforming] = useState<boolean>(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const { credits, setCredits } = useCreditContext();
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

  const handleDownload = useCallback(async () => {
    if (!imageRef.current) return;

    try {
      await downloadImage(imageRef.current.src);

      const res = await updateCredits();
      if (res.success) {
        setCredits(res.credits);
        router.push("/social-share");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to download image.");
    }
  }, [setCredits, router]);

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
}
