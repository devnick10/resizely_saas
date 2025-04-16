"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Videos from "@/components/Videos";
import { useCreditContext } from "@/context";
import { videoUpload } from "@/actions/videoUpload";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

function VideoUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<unknown>();
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const router = useRouter();
  const MAX_FILE_SIZE = 100 * 1024 * 1024;
  const { credits } = useCreditContext();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) return;
    if (file.size > MAX_FILE_SIZE) {
      toast.error("File size too large");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("originalSize", file.size.toString());

    try {
      if (!credits) {
        return toast.error("Insufficient credits, please buy more.");
      }

      const response = await videoUpload(formData);
      if (!response.success) {
        toast.error("Failed to upload video");
        return;
      }
      toast.success("Video uploaded.");
      router.push("/home");
    } catch (error) {
      setError(error);
      toast.error("Failed to upload video");
    } finally {
      setIsUploading(false);
    }
  };

  if (error) {
    toast.error("Sorry for the inconvenience");
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-center">
        Upload Video
      </h1>
      <p className="text-center font-semibold mb-6">
        Video Compression Service – Currently for Videos up to 70MB (More Coming Soon!) 🚀
      </p>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Upload a Video</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="video">Video File</Label>
              <Input
                id="video"
                type="file"
                accept="video/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                required
              />
            </div>

            <Button type="submit" disabled={isUploading} className="w-full">
              {isUploading ? "Uploading..." : "Upload Video"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="mt-8">
        <Videos />
      </div>
    </div>
  );
}

export default VideoUpload;
