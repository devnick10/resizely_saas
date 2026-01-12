"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { throwClientError } from "@/helper/clientError";
import { useVideoUpload } from "@/hooks/useVideoUpload";
import { useCreditsStore } from "@/stores/hooks";
import { VideoUploadPayload } from "@/types";
import React, { ChangeEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Loader } from "../core/Loader";
const ERROR = null;

export const VIdeoUploadForm: React.FC = () => {
  const { isUploading, uploadVideo, error } = useVideoUpload();
  const { credits } = useCreditsStore((state) => state);

  const [payload, setPayload] = useState<VideoUploadPayload>({
    title: "",
    description: "",
    file: null,
  });

  useEffect(() => {
    if (error) {
      throwClientError(error);
    }
  }, [error]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!payload.file) {
      toast.error("Please select the file.");
      return;
    }
    if (!credits || credits <= 0) {
      toast.error("Insufficient credits, please buy more.");
      return;
    }

    try {
      await uploadVideo(payload);
      setPayload({
        title: "",
        description: "",
        file: null,
      });
      toast.success("Video uploaded successfully");
    } catch (error: unknown) {
      throwClientError(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          type="text"
          value={payload.title}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setPayload((prev) => ({
              ...prev,
              title: e.target.value,
            }))
          }
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={payload.description}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
            setPayload((prev) => ({ ...prev, description: e.target.value }))
          }
        />
      </div>

      <div className="mb-4 space-y-2">
        <Label htmlFor="video">Video File</Label>
        <Input
          id="video"
          type="file"
          accept="video/*"
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (!file) {
              throwClientError(ERROR, "File is required");
              return;
            }
            setPayload((prev) => ({
              ...prev,
              file,
            }));
          }}
          required
        />
      </div>
      <Button type="submit" disabled={isUploading} className="w-full">
        {isUploading ? <Loader label="Uploading" /> : "Upload Video"}
      </Button>
    </form>
  );
};
