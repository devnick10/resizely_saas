"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { CldImage } from "next-cloudinary";
import Image from "next/image";
import axios from "axios";
import { useCreditContext } from "@/context";
import toast from "react-hot-toast";

export default function SocialShare() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isTransforming, setIsTransforming] = useState<boolean>(false);
  const imageRef = useRef<HTMLImageElement>(null);

  const { setCredits } = useCreditContext();

  useEffect(() => {
    if (uploadedImage) setIsTransforming(true);
    if (originalImage) URL.revokeObjectURL(originalImage);
  }, [originalImage, uploadedImage]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/image-upload", {
        method: "POST",
        body: formData,
      });

      

      if (!response.ok) return toast.error("Failed to upload image");
      
      const data = await response.json();
      setOriginalImage(URL.createObjectURL(file));
      setUploadedImage(data.publicId);
    } catch (error) {
      toast.error("Failed to upload image.");
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

      const res = await axios.get("/api/use-credit");
      if (res.data.credit) setCredits(res.data.credit);
    } catch (error) {
      toast.error("Failed to download image.");
    }
  }, [setCredits]);

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-4 text-center">AI Background Remover</h1>
      <p className="font-bold mb-6 text-xl tracking-tight text-center">
        Effortlessly remove backgrounds and resize images for any social media platform with <br /> AI-powered precision—fast, seamless, and high-quality results!
      </p>

      <div className="card">
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
                      <div className="bg-base-200 text-primary-content grid place-content-center text-9xl font-black">
                        <Image src={originalImage} alt="Original Image" width={400} height={400} />
                      </div>
                    </div>

                    <div className="diff-item-2">
                      <div className="bg-base-200 grid place-content-center text-9xl font-black">
                        <CldImage
                          width={400}
                          height={400}
                          src={uploadedImage || "server down"}
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