"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { CldImage } from "next-cloudinary";
import Image from "next/image";
import { useCreditContext } from "@/context";
import toast from "react-hot-toast";
import { getUser } from "@/actions/getUser";
import { updateCredits } from "@/actions/updateCredits";
import { imageUpload } from "@/actions/imageUpload";

export default function BgRemover() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<unknown>();
  const [isTransforming, setIsTransforming] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const { credits, setCredits } = useCreditContext();


  // Handle File Upload
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

      const response = await imageUpload(formData)

      if (!response.success) throw new Error("Image upload failed");

      if (response.publicId) {
        setOriginalImage(URL.createObjectURL(file));
        setUploadedImage(response.publicId);
      }
    } catch (error) {
      setError(error)
      toast.error("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };
  // Handle Image Download
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
      setError(error)
      toast.error("Failed to download image. Please try again.");
    }
  }, [setCredits]);


  useEffect(() => {
    if (uploadedImage) setIsTransforming(true);
    return () => {
      if (originalImage) URL.revokeObjectURL(originalImage);
    };
  }, [originalImage, uploadedImage]);

  if (error) {
    toast.error("Something went wrong")
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="sm:text-3xl text-2xl font-bold mb-4 text-center">AI Background Remover</h1>
      <p className="font-bold mb-6 sm:text-xl text-center ">
        Effortlessly remove backgrounds and resize images for any social media platform with
        AI-powered precision—fast, seamless, and high-quality results!
      </p>

      <div className="card  border-gray-500 border-t rounded-none ">
        <div className="card-body">
          <h2 className="card-title mb-4">Upload an Image</h2>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Choose an image file</span>
            </label>
            <input
              type="file"
              onChange={handleFileUpload}
              className="file-input file-input-bordered file-input-primary w-full"
            />
          </div>

          {isUploading && (
            <div className="mt-4">
              <progress className="progress progress-primary w-full"></progress>
            </div>
          )}

          {uploadedImage && originalImage && (
            <div>
              <div className="mt-6 relative">
                <h3 className="text-lg font-semibold mb-2">Before & After:</h3>
                <div className="flex justify-center">
                  {isTransforming && (
                    <div className="absolute inset-0 flex items-center justify-center bg-base-100 bg-opacity-50 z-10">
                      <span className="loading loading-spinner loading-lg"></span>
                    </div>
                  )}

                  <div className="diff aspect-[16/9]">
                    <div className="diff-item-1">
                      <div className="bg-base-200 grid place-content-center text-9xl font-black">
                        <Image src={originalImage} alt="Original Image" width={400} height={400} />
                      </div>
                    </div>

                    <div className="diff-item-2">
                      <div className="bg-base-200 grid place-content-center text-9xl font-black">
                        <CldImage
                          width={400}
                          height={400}
                          src={uploadedImage}
                          sizes="100vw"
                          alt="Transformed Image"
                          removeBackground
                          ref={imageRef}
                          onLoad={() => setIsTransforming(false)}
                        />
                      </div>
                    </div>

                    <div className="diff-resizer"></div>
                  </div>
                </div>
              </div>

              <div className="card-actions justify-end mt-6">
                <button className="btn btn-primary" onClick={handleDownload}>
                  Download
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
