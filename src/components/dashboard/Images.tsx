import { getImages } from "@/lib/data/getImages";
import { ImageCard } from "./ImageCard";

export const Images: React.FC = async () => {
  const images = await getImages();
  return (
    <div>
      {!images ||
        (images.length == 0 && (
          <div className="text-center text-lg text-gray-500">No imges yet.</div>
        ))}
      {images && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((img, idx) => (
            <ImageCard key={idx} image={img} />
          ))}
        </div>
      )}
    </div>
  );
};
