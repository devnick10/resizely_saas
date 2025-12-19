"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import useVideoCard from "@/hooks/useVideoCard";
import { Video } from "@/types";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Clock, Download, FileDown, FileUp } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useMemo, useState } from "react";

dayjs.extend(relativeTime);

interface VideoCardProps {
  video: Video;
}

export const VideoCard: React.FC<VideoCardProps> = ({ video }) => {
  const {
    handleDownload,
    formatDuration,
    formatSize,
    getFullVideoUrl,
    getPreviewVideoUrl,
    getThumbnailUrl,
  } = useVideoCard();
  const [isHovered, setIsHovered] = useState(false);
  const [previewError, setPreviewError] = useState(false);

  useEffect(() => {
    setPreviewError(false);
  }, [isHovered]);

  const compressionPercentage = useMemo(() => {
    return Math.round(
      (1 - Number(video.compressSize) / Number(video.originalSize)) * 100,
    );
  }, [video]);

  return (
    <Card
      className="shadow transition-shadow duration-300 hover:shadow-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader className="relative aspect-video overflow-hidden rounded-t-md p-0">
        {isHovered && (
          <video
            src={getPreviewVideoUrl(String(video.publicId))}
            autoPlay
            muted
            loop
            className="h-full w-full object-cover"
            onError={() => setPreviewError(true)}
          />
        )}
        {previewError && (
          <div className="flex h-full w-full items-center justify-center bg-muted">
            <p className="text-sm text-destructive">Preview not available</p>
          </div>
        )}
        <Image
          src={getThumbnailUrl(String(video.publicId))}
          alt={video.title}
          width={400}
          height={225}
          className="h-full w-full object-cover"
        />
        <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded bg-background/80 px-2 py-1 text-sm text-foreground">
          <Clock size={14} />
          {formatDuration(video.duration)}
        </div>
      </CardHeader>

      <CardContent className="space-y-2 p-4">
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

      <CardFooter className="flex items-center justify-between px-4 pb-4">
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
          <Download className="mr-1 h-4 w-4" /> Download
        </Button>
      </CardFooter>
    </Card>
  );
};
