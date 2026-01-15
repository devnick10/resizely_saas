"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { throwClientError } from "@/helper/clientError";
import { downloadFile } from "@/helper/downloadFile";
import { useImageUpload } from "@/hooks/useImageUpload";
import { useCreditsStore } from "@/stores/hooks";
import { CldImage } from "next-cloudinary";
import React, { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import Image from "next/image";
import { Loader } from "@/components/core/Loader";
import { saveTransformation } from "@/actions/saveTransformations";
import { persistBgRemovedImage } from "@/actions/uploadIrreversibleTransformations";
import { useLoading } from "@/hooks/useLoading";
import { Spinner } from "@/components/core/Spinner";

export const BgRemover: React.FC = () => {
  const { error, uploadImage, isUploading } = useImageUpload();
  const { credits, setCredits } = useCreditsStore((state) => state);
  const { setLoading, loading } = useLoading();

  const [originalImage, setOriginalImage] = useState<string>("");
  const [uploadedImage, setUploadedImage] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");

  const [imageTransformingError, setImageTransformingError] = useState(false);
  const [isTransforming, setIsTransforming] = useState<boolean>(false);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (uploadedImage) setIsTransforming(true);
    if (error) {
      throwClientError(error);
    }
  }, [error, uploadedImage]);

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
      setOriginalImage(URL.createObjectURL(file));
      setFileName(file.name);
      setUploadedImage(response.publicId!);
      setCredits(credits - 1);
      toast.success("Image uploaded successfully!");
    } catch (error: unknown) {
      setIsTransforming(false);
      throwClientError(error, "Failed to upload image.");
    }
  };

  const saveImage = async () => {
    if (!imageRef.current) {
      toast.error("Image not ready yet.");
      return;
    }

    try {
      setLoading(true);
      //  generate final image URL
      const transformedUrl = imageRef.current.src;

      // upload irreversible asset
      const { publicId: transformedPublicId } =
        await persistBgRemovedImage(transformedUrl);

      //save to DB
      await saveTransformation({
        imagePublicId: uploadedImage,
        transformedPublicId,
        type: "IRREVERSIBLE",
      });

      toast.success("Transformed image saved successfully!");
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
              onChange={handleSubmit}
              disabled={isUploading}
            />
          </div>

          {isUploading && (
            <div className="flex w-full justify-center">
              <Loader label="Uploading" />
            </div>
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
                    <div className="flex h-1/2 w-full items-center justify-center">
                      <Loader label="Processing" />
                    </div>
                  )}
                  {!imageTransformingError && (
                    <CldImage
                      width={400}
                      height={400}
                      src={uploadedImage}
                      sizes="100vw"
                      alt="Transformed Image"
                      removeBackground
                      format="png"
                      background="transparent"
                      ref={imageRef}
                      onLoad={() => setIsTransforming(false)}
                      onError={() => {
                        setIsTransforming(false);
                        setImageTransformingError(true);
                        toast.error(
                          "Background removal failed. Internal server error!.",
                        );
                      }}
                      className="mx-auto rounded-lg"
                    />
                  )}
                  {imageTransformingError && (
                    <h4 className="w-full text-center text-red-500">
                      Internal Server Error! <br /> Try again after few minutes
                    </h4>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={() => saveImage()} className="">
                  Save {loading && <Spinner />}
                </Button>
                <Button onClick={handleDownload}>Download</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
