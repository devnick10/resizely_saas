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
          onChange={(e: ChangeEvent<HTMLInputElement>) => ({
            ...payload,
            titile: e.target.value,
          })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={payload.description}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => ({
            ...payload,
            description: e.target.value,
          })}
        />
      </div>

      <div className="mb-4 space-y-2">
        <Label htmlFor="video">Video File</Label>
        <Input
          id="video"
          type="file"
          accept="video/*"
          onChange={(e: ChangeEvent<HTMLInputElement>) => ({
            ...payload,
            file: e.target.value,
          })}
          required
        />
      </div>
      <Button type="submit" disabled={isUploading} className="w-full">
        {isUploading ? <Loader label="Uploading" /> : "Upload Video"}
      </Button>
    </form>
  );
};
