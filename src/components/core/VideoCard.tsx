"use client";
import { deleteVideo } from "@/actions/deleteVideoAssets";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { throwClientError } from "@/helper/clientError";
import { downloadFile } from "@/helper/downloadFile";
import { Video } from "@/types";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { filesize } from "filesize";
import { Clock, Download, FileDown, FileUp, TrashIcon } from "lucide-react";
import { getCldImageUrl, getCldVideoUrl } from "next-cloudinary";
import Image from "next/image";
import React, { useCallback, useEffect, useMemo, useState } from "react";

dayjs.extend(relativeTime);

interface VideoCardProps {
  video: Video;
}

export const VideoCard: React.FC<VideoCardProps> = ({ video }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [previewError, setPreviewError] = useState(false);

  useEffect(() => {
    setPreviewError(false);
  }, [isHovered]);

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

  const compressionPercentage = useMemo(() => {
    return Math.round(
      (1 - Number(video.compressSize) / Number(video.originalSize)) * 100,
    );
  }, [video]);

  const handleDownload = async (url: string, title: string) => {
    try {
      await downloadFile({ url, filename: `${title}.mp4` });
    } catch (error) {
      throwClientError(error, "Failed to download image.");
    }
  };

  return (
    <Card
      className="w-full max-w-xs font-inter shadow transition-shadow duration-300 hover:shadow-lg"
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
        <CardTitle className="font-poppins text-base font-semibold">
          {video.title}
        </CardTitle>
        <p className="font-poppins text-sm text-muted-foreground">
          {video.description}
        </p>
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
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="default"
            onClick={() =>
              handleDownload(getFullVideoUrl(video.publicId), video.title)
            }
          >
            <Download className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => deleteVideo(video.publicId)}
          >
            <TrashIcon className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
