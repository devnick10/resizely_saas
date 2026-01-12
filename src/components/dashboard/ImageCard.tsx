"use client";

import { Image as ImageType } from "@/types";
import { TransformationCard } from "./TransformationCard";

interface ImageCardProps {
  image: ImageType;
}

export const ImageCard: React.FC<ImageCardProps> = ({ image }) => {
  return (
    <div className="space-y-4">
      <div>
        {image.transformations.map((t) => (
          <TransformationCard
            key={t.id}
            type={t.type}
            publicId={image.publicId}
            tranformedPublicId={t.tranformedPublicId}
            transformation={t.transformation}
            createdAt={t.createdAt}
          />
        ))}
      </div>
    </div>
  );
};
