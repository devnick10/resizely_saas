import React from "react";
import { FeatureCard } from "@/components/landing/FeatureCard";

export const FeaturesSection: React.FC = () => {
  return (
    <section id="features" className="bg-white py-20 dark:bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            Powerful Features
          </h2>
          <p className="mx-auto max-w-[800px] text-gray-600 dark:text-gray-400 md:text-lg">
            Resizely combines cutting-edge AI with intuitive design to make
            media processing simple and efficient.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <FeatureCard
            src="https://res.cloudinary.com/dnr1sgjrx/image/upload/v1744802385/videocomp_kweghx.png"
            title="Video Compression"
            description="Reduce file sizes without sacrificing quality. Perfect for websites, social media, and email attachments."
          />
          <FeatureCard
            src="https://res.cloudinary.com/dnr1sgjrx/image/upload/v1744802385/bg-remove_booi8p.png"
            title="Background Removal"
            description="Instantly remove backgrounds from images with our advanced AI. No more tedious manual editing."
          />
          <FeatureCard
            src="https://res.cloudinary.com/dnr1sgjrx/image/upload/v1744802387/resize_jk2jwt.png"
            title="Social Media Resizer"
            description="Automatically resize your images for any social platform with AI that preserves the important parts."
          />
        </div>
      </div>
    </section>
  );
};
