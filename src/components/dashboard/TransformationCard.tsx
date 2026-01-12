"use client";

import { deleteImage } from "@/actions/deleteImageAssets";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import { throwClientError } from "@/helper/clientError";
import { downloadFile } from "@/helper/downloadFile";
import { useLoading } from "@/hooks/useLoading";
import { Transformation } from "@/types";
import { TransformationType } from "@prisma/client";
import dayjs from "dayjs";
import { Crop, Download, Layers, TrashIcon } from "lucide-react";
import { getCldImageUrl } from "next-cloudinary";
import Image from "next/image";
import { Spinner } from "../core/Spinner";

interface TransformationCardProps {
  publicId: string;
  type: TransformationType;
  tranformedPublicId?: string;
  transformation?: Transformation;
  createdAt: string;
}

const getImageUrl = (publicId: string, transformation?: Transformation) =>
  getCldImageUrl({
    src: publicId,
    width: 600,
    quality: "auto",
    format: "auto",
    ...(transformation ?? {}),
  });

export const TransformationCard: React.FC<TransformationCardProps> = ({
  publicId,
  tranformedPublicId,
  type,
  transformation,
  createdAt,
}) => {
  const { setLoading, loading } = useLoading();
  const fullImageUrl =
    type === "DERIVED"
      ? getImageUrl(publicId, transformation)
      : getImageUrl(tranformedPublicId!);

  const handleDownload = async () => {
    try {
      await downloadFile({
        url: fullImageUrl,
        filename: `image-${publicId}`,
      });
    } catch (error) {
      throwClientError(error, "Failed to download image");
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    const deletePublicId =
      type === "DERIVED" ? publicId : tranformedPublicId || "";
    try {
      await deleteImage({
        type,
        public_id: deletePublicId,
      });
    } catch (error) {
      throwClientError(error, "Failed to download image");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-0">
        <Image
          src={fullImageUrl}
          alt="image"
          width={400}
          height={225}
          className="h-full w-full object-cover"
        />
      </CardHeader>
      <CardFooter className="flex w-full flex-col gap-3 px-4 py-3 sm:flex-col sm:items-center sm:justify-between">
        {/* LEFT CONTENT */}
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground">
            {dayjs(createdAt).format("DD MMM YYYY")}
          </span>
          <TransformationStats type={type} data={transformation} />
        </div>

        {/* ACTIONS */}
        <div className="flex w-full gap-2 sm:w-auto sm:justify-end">
          <Button
            size="sm"
            variant="outline"
            className="flex-1 sm:flex-none"
            onClick={handleDownload}
          >
            <Download className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Download</span>
          </Button>

          <Button
            size="icon"
            variant="destructive"
            className="shrink-0"
            onClick={handleDelete}
          >
            {loading ? <Spinner /> : <TrashIcon size={16} />}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

function TransformationStats({
  data,
  type,
}: {
  data?: Transformation;
  type: TransformationType;
}) {
  if (!data && type !== "IRREVERSIBLE") return null;

  return (
    <div className="mt-2 space-y-2 text-xs text-muted-foreground">
      {/* STATUS BADGE */}
      <div>
        <Badge
          variant={type === "DERIVED" ? "secondary" : "destructive"}
          className="gap-1"
        >
          {type === "DERIVED" ? (
            <>
              <Layers className="h-3 w-3" />
              Derived
            </>
          ) : (
            <>
              <Crop className="h-3 w-3" />
              Background Removed
            </>
          )}
        </Badge>
      </div>

      {/* DETAILS */}
      {type === "DERIVED" && data?.resize && (
        <div className="flex flex-col gap-1">
          <span>
            Size:{" "}
            <strong>
              {data.resize.width} × {data.resize.height}
            </strong>
          </span>
          {data.resize.aspectRatio && (
            <span>
              Ratio: <strong>{data.resize.aspectRatio}</strong>
            </span>
          )}
        </div>
      )}
    </div>
  );
}
