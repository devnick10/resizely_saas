import { getVideos } from "@/lib/data/user/getVideos";
import { VideoCard } from "@/components/core/VideoCard";

export const Videos: React.FC = async () => {
  const videos = await getVideos();
  return (
    <>
      {!videos ||
        (videos.length == 0 && (
          <div className="text-center text-lg text-gray-500">
            No videos yet.
          </div>
        ))}
      {videos && (
        <div className="flex flex-wrap gap-2 sm:gap-4">
          {videos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      )}
    </>
  );
};
