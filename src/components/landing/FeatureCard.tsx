import Image from "next/image";
import React from "react";

interface FeatureCardProps {
  title: string;
  description: string;
  src: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = (props) => {
  return (
    <div className="flex h-full flex-col rounded-lg border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-muted">
      <div className="mb-4">
        <Image
          src={props.src}
          width={1000}
          height={1000}
          alt="image"
          className="aspect-video rounded-lg object-cover"
        />
      </div>
      <div className="mt-4">
        <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
          {props.title}
        </h3>
        <p className="text-gray-500 dark:text-gray-400">{props.description}</p>
      </div>
    </div>
  );
};
