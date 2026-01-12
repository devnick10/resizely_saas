"use client";

import { saveTransformation } from "@/actions/saveTransformations";
import { Loader } from "@/components/core/Loader";
import { Spinner } from "@/components/core/Spinner";
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
import { useLoading } from "@/hooks/useLoading";
import { useCreditsStore } from "@/stores/hooks";
import { CldImage } from "next-cloudinary";
import React, { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

type SocialFormat = keyof typeof socialFormats;
const MAX_DIMENSION = 65500;
const MIN_DIMENSION = 1;

export const Resize: React.FC = () => {
  const { error, isUploading, uploadImage } = useImageUpload();
  const { credits } = useCreditsStore((state) => state);
  const { loading, setLoading } = useLoading();

  const [mode, setMode] = useState<"social" | "custom">("social");
  const [customWidth, setCustomWidth] = useState<number>(1080);
  const [customHeight, setCustomHeight] = useState<number>(1080);

  const defaultFormat = Object.keys(socialFormats)[0] as SocialFormat;

  const [uploadedImage, setUploadedImage] = useState<string>("");
  const [selectedFormat, setSelectedFormat] =
    useState<SocialFormat>(defaultFormat);
  const [fileName, setFileName] = useState<string>("");
  const [isTransforming, setIsTransforming] = useState<boolean>(false);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (uploadedImage) setIsTransforming(true);
    if (error) {
      throwClientError(error);
    }
  }, [selectedFormat, uploadedImage, error]);

  const transformConfig =
    mode === "social"
      ? {
          width: socialFormats[selectedFormat].width,
          height: socialFormats[selectedFormat].height,
          aspectRatio: socialFormats[selectedFormat].aspectRatio,
        }
      : {
          width: customWidth,
          height: customHeight,
          aspectRatio: undefined,
        };

  const isValidSize =
    transformConfig.width <= MAX_DIMENSION &&
    transformConfig.height <= MAX_DIMENSION;

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

  const saveImage = async () => {
    setLoading(true);
    try {
      await saveTransformation({
        imagePublicId: uploadedImage,
        type: "DERIVED",
        transformation: { resize: { ...transformConfig } },
      });
      toast.success("Image saved successfully!");
    } catch (error) {
      throwClientError(error, "Failed to save image.");
    } finally {
      setLoading(false);
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

  if (!isValidSize) {
    toast.error("Max allowed image size is 65,500px.");
    return null;
  }

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
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* LEFT SIDE – CONTROLS */}
              <div className="space-y-6">
                {/* FORMAT */}
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

                {/* MODE */}
                <div>
                  <Label>Resize Mode</Label>
                  <Select
                    value={mode}
                    onValueChange={(val) => setMode(val as "social" | "custom")}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="social">
                        Social Media Format
                      </SelectItem>
                      <SelectItem value="custom">Custom Size</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* CUSTOM SIZE */}
                {mode === "custom" && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Width (px)</Label>
                      <Input
                        type="number"
                        min={MIN_DIMENSION}
                        max={MAX_DIMENSION}
                        value={customWidth}
                        onChange={(e) => setCustomWidth(Number(e.target.value))}
                      />
                    </div>
                    <div>
                      <Label>Height (px)</Label>
                      <Input
                        type="number"
                        min={MIN_DIMENSION}
                        max={MAX_DIMENSION}
                        value={customHeight}
                        onChange={(e) =>
                          setCustomHeight(Number(e.target.value))
                        }
                      />
                    </div>
                  </div>
                )}
                <Button onClick={saveImage} className="w-full">
                  Save{" "}
                  {!loading ? (
                    mode === "custom" ? (
                      `${customWidth}×${customHeight}`
                    ) : (
                      selectedFormat
                    )
                  ) : (
                    <Spinner />
                  )}
                </Button>
                {/* DOWNLOAD */}
                <Button onClick={handleDownload} className="w-full">
                  Download{" "}
                  {mode === "custom"
                    ? `${customWidth}×${customHeight}`
                    : selectedFormat}
                </Button>
              </div>

              {/* RIGHT SIDE – PREVIEW */}
              <div className="relative flex justify-center lg:sticky lg:top-24">
                <div className="relative">
                  {isTransforming && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/70">
                      <span className="h-6 w-6 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
                    </div>
                  )}
                  {uploadedImage && (
                    <CldImage
                      width={transformConfig.width}
                      height={transformConfig.height}
                      aspectRatio={transformConfig.aspectRatio}
                      src={uploadedImage}
                      crop="fill"
                      gravity="auto"
                      sizes="100vw"
                      alt="transformed image"
                      ref={imageRef}
                      onLoad={() => setIsTransforming(false)}
                      className="max-h-[70vh] w-auto rounded-lg shadow-md"
                    />
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
