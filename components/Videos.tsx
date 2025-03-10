"use client"
import React, { useState, useEffect, useCallback } from 'react'
import VideoCard from '@/components/VideoCard'
import { Video } from '@/types'
import { getVideos } from '@/actions/getVideos'
import { getUser } from '@/actions/getUser'
import toast from 'react-hot-toast'
function Videos() {

  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<unknown>()

  useEffect(() => {
    const fetchVideos = async () => {
      const { userId } = await getUser()
      try {
        if (!userId) return null

        setLoading(true);
        const { data } = await getVideos(userId);

        setVideos(data || []);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [setVideos]);


  const handleDownload = useCallback((url: string, title: string) => {

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${title}.mp4`);
    link.setAttribute("target", "_blank");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);


  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    toast.error("Sorry for inconvenience")
  }

  return (
    <div className="container mt-5 mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">All Videos</h1>
      {videos.length === 0 ? (
        <div className="text-center text-lg text-gray-500">
          No videos available
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {
            videos.map((video) => (
              <VideoCard
                key={video.id}
                video={video}
                onDownload={handleDownload}
              />
            ))
          }
        </div>
      )}
    </div>
  );
}

export default Videos