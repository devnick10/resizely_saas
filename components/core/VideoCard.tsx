"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Video } from "@/types";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { filesize } from "filesize";
import { Clock, Download, FileDown, FileUp } from "lucide-react";
import { getCldImageUrl, getCldVideoUrl } from "next-cloudinary";
import Image from "next/image";
import React, { useEffect, useMemo, useState } from "react";

dayjs.extend(relativeTime);

interface VideoCardProps {
  video: Video;
}

const VideoCard: React.FC<VideoCardProps> = ({ video }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [previewError, setPreviewError] = useState(false);

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

  const formatDuration = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = Math.round(seconds % 60);
    return `${min}:${sec.toString().padStart(2, "0")}`;
  };

  const compressionPercentage = useMemo(
    () =>
      Math.round(
        (1 - Number(video.compressSize) / Number(video.originalSize)) * 100,
      ),
    [video],
  );

  useEffect(() => {
    setPreviewError(false);
  }, [isHovered]);

  const handleDownload = (url: string, title: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${title}.mp4`);
    link.setAttribute("target", "_blank");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card
      className="transition-shadow duration-300 shadow hover:shadow-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader className="p-0 relative aspect-video overflow-hidden rounded-t-md">
        {isHovered ? (
          previewError ? (
            <div className="w-full h-full flex items-center justify-center bg-muted">
              <p className="text-sm text-destructive">Preview not available</p>
            </div>
          ) : (
            <video
              src={getPreviewVideoUrl(String(video.publicId))}
              autoPlay
              muted
              loop
              className="w-full h-full object-cover"
              onError={() => setPreviewError(true)}
            />
          )
        ) : (
          <Image
            src={getThumbnailUrl(String(video.publicId))}
            alt={video.title}
            width={400}
            height={225}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute bottom-2 right-2 bg-background/80 px-2 py-1 rounded text-sm flex items-center gap-1 text-foreground">
          <Clock size={14} />
          {formatDuration(video.duration)}
        </div>
      </CardHeader>

      <CardContent className="p-4 space-y-2">
        <CardTitle className="text-base font-semibold">{video.title}</CardTitle>
        <p className="text-sm text-muted-foreground">{video.description}</p>
        <p className="text-xs text-muted-foreground">
          Uploaded {dayjs(video.createdAt).fromNow()}
        </p>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <FileUp size={16} className="text-primary" />
            <div>
              <div className="font-medium">Original</div>
              <div>{formatSize(Number(video.originalSize))}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <FileDown size={16} className="text-secondary" />
            <div>
              <div className="font-medium">Compressed</div>
              <div>{formatSize(Number(video.compressSize))}</div>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="px-4 pb-4 flex justify-between items-center">
        <span className="text-sm">
          Compression:{" "}
          <span className="font-semibold text-green-600">
            {compressionPercentage}%
          </span>
        </span>
        <Button
          size="sm"
          variant="default"
          onClick={() =>
            handleDownload(getFullVideoUrl(video.publicId), video.title)
          }
        >
          <Download className="w-4 h-4 mr-1" /> Download
        </Button>
      </CardFooter>
    </Card>
  );
};

export default VideoCard;
