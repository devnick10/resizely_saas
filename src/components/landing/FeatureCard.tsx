import Image from "next/image";
import React from "react";

interface FeatureCardProps {
  title: string;
  description: string;
  src: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = (props) => {
  return (
    <div className="flex flex-col bg-white dark:bg-muted p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 transition-all hover:shadow-md h-full">
      <div className="mb-4">
        <Image
          src={props.src}
          width={1000}
          height={1000}
          alt="image"
          className="object-cover rounded-lg aspect-video"
        />
      </div>
      <div className="mt-4">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          {props.title}
        </h3>
        <p className="text-gray-500 dark:text-gray-400">{props.description}</p>
      </div>
    </div>
  );
};
