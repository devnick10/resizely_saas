import { getVideos } from "@/lib/data/user/getVideos";
import VideoCard from "@/components/core/VideoCard";

async function Videos() {
  const { data: videos } = await getVideos();

  return (
    <div className="container mt-5 mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">All Videos</h1>
      {!videos || videos.length == 0 ? (
        <div className="text-center text-lg text-gray-500">No videos yet.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Videos;
