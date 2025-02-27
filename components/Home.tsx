"use client";

import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import VideoCard from "@/components/VideoCard";
import { Video } from "@/types";
import { useCreditContext } from "@/context";
import toast from "react-hot-toast";

function Home() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const { setCredits } = useCreditContext();

  // Fetch Videos
  const fetchVideos = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/videos");
       toast.custom(response.data.message)
      if (Array.isArray(response.data)) {
        setVideos(response.data);
      } else {
        throw new Error("Unexpected response format");
      }
    
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  // Handle Video Download and Deduct Credits
  const handleDownload = useCallback(
    async (url: string, title: string) => {
      try {
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${title}.mp4`);
        link.setAttribute("target", "_blank");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        const res = await axios.get("/api/use-credit");

        if (res.status === 200) {
          setCredits(res.data.credit);
          toast.success("1 Credit Used. Enjoy your download!");
        } else {
          throw new Error("Failed to update credits.");
        }
      } catch (error) {
        toast.error("Error downloading video or deducting credit.");
      }
    },
    [setCredits]
  );

  return (
    <div className="container min-h-screen mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Videos</h1>

      {loading ? (
        <div className="text-center text-lg text-gray-500">Loading videos...</div>
      ) : videos.length === 0 ? (
        <div className="text-center text-lg text-gray-500">No videos available</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <VideoCard key={video.id} video={video} onDownload={handleDownload} />
          ))}
        </div>
      )}
    </div>
  );


}

export default Home;



