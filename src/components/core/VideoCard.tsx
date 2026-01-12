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
import { useLoading } from "@/hooks/useLoading";
import { Video } from "@/types";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { filesize } from "filesize";
import { Clock, Download, FileDown, FileUp, TrashIcon } from "lucide-react";
import { getCldImageUrl, getCldVideoUrl } from "next-cloudinary";
import Image from "next/image";
import { useMemo, useState } from "react";
import { Spinner } from "./Spinner";

dayjs.extend(relativeTime);

interface VideoCardProps {
  video: Video;
}

const formatDuration = (seconds: number) => {
  const min = Math.floor(seconds / 60);
  const sec = Math.round(seconds % 60);
  return `${min}:${sec.toString().padStart(2, "0")}`;
};

const thumbnailUrl = (publicId: string) =>
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

const previewUrl = (publicId: string) =>
  getCldVideoUrl({
    src: publicId,
    width: 400,
    height: 225,
    rawTransformations: ["e_preview:duration_10"],
  });

const fullVideoUrl = (publicId: string) => getCldVideoUrl({ src: publicId });

export const VideoCard = ({ video }: VideoCardProps) => {
  const { loading, setLoading } = useLoading();

  const [hovered, setHovered] = useState(false);
  const [previewError, setPreviewError] = useState(false);

  const compression = useMemo(() => {
    return Math.round(
      (1 - Number(video.compressSize) / Number(video.originalSize)) * 100,
    );
  }, [video]);

  const handleDownload = async () => {
    try {
      await downloadFile({
        url: fullVideoUrl(video.publicId),
        filename: `${video.title}.mp4`,
      });
    } catch (error) {
      throwClientError(error, "Failed to download video");
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteVideo(video.publicId);
    } catch (error) {
      throwClientError(error, "Failed to download image");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      className="w-full max-w-sm shadow-sm transition hover:shadow-md"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setPreviewError(false);
      }}
    >
      <CardHeader className="relative aspect-video overflow-hidden p-0">
        {hovered && !previewError ? (
          <video
            src={previewUrl(video.publicId)}
            autoPlay
            muted
            loop
            className="h-full w-full object-cover"
            onError={() => setPreviewError(true)}
          />
        ) : (
          <Image
            src={thumbnailUrl(video.publicId)}
            alt={video.title}
            width={400}
            height={225}
            className="h-full w-full object-cover"
          />
        )}

        <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded bg-background/80 px-2 py-1 text-xs">
          <Clock size={14} />
          {formatDuration(video.duration)}
        </div>
      </CardHeader>

      <CardContent className="space-y-1 p-4">
        <CardTitle className="text-sm font-semibold">{video.title}</CardTitle>

        <p className="line-clamp-2 text-xs text-muted-foreground">
          {video.description}
        </p>

        <p className="text-xs text-muted-foreground">
          Uploaded {dayjs(video.createdAt).fromNow()}
        </p>

        <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
          <Stat
            icon={<FileUp size={14} />}
            label="Original"
            value={filesize(Number(video.originalSize))}
          />
          <Stat
            icon={<FileDown size={14} />}
            label="Compressed"
            value={filesize(Number(video.compressSize))}
          />
        </div>
      </CardContent>

      <CardFooter className="flex justify-between px-4 pb-4">
        <span className="text-xs">
          Saved <b className="text-green-600">{compression}%</b>
        </span>

        <div className="flex gap-2">
          <Button size="icon" onClick={handleDownload}>
            <Download size={16} />
          </Button>
          <Button size="icon" variant="destructive" onClick={handleDelete}>
            {loading ? <Spinner /> : <TrashIcon size={16} />}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

const Stat = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => (
  <div className="flex items-center gap-2">
    {icon}
    <div>
      <p className="font-medium">{label}</p>
      <p className="text-muted-foreground">{value}</p>
    </div>
  </div>
);
