import { getVideos } from "@/lib/data/user/getVideos";
import { VideoCard } from "@/components/core/VideoCard";

export const Videos: React.FC = async () => {
  const videos = await getVideos();
  return (
    <div>
      {!videos ||
        (videos.length == 0 && (
          <div className="text-center text-lg text-gray-500">
            No videos yet.
          </div>
        ))}
      {videos && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {videos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      )}
    </div>
  );
};
