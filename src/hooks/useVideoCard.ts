"use client";
import { filesize } from "filesize";
import { getCldImageUrl, getCldVideoUrl } from "next-cloudinary";
import { useCallback } from "react";

export default function useVideoCard() {
  const getThumbnailUrl = (publicId: string) =>
    getCldImageUrl({
      src: publicId,
      width: 400,
      height: 225,
      crop: "fill",
      gravity: "auto",
      format: "jpg",
      quality: "auto",
      assetType: "video",
    });

  const getFullVideoUrl = (publicId: string) =>
    getCldVideoUrl({
      src: publicId,
      width: 1920,
      height: 1080,
    });

  const getPreviewVideoUrl = (publicId: string) =>
    getCldVideoUrl({
      src: publicId,
      width: 400,
      height: 225,
      rawTransformations: ["e_preview:duration_10:max_seg_9:min_seg_dur_1"],
    });

  const formatSize = (size: number) => filesize(size);

  const formatDuration = useCallback((seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = Math.round(seconds % 60);
    return `${min}:${sec.toString().padStart(2, "0")}`;
  }, []);

  const handleDownload = (url: string, title: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${title}.mp4`);
    link.setAttribute("target", "_blank");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return {
    getThumbnailUrl,
    getPreviewVideoUrl,
    getFullVideoUrl,
    formatSize,
    formatDuration,
    handleDownload,
  };
}
