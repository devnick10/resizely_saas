import React from "react";
import { HeroImage } from "@/components/landing/HeroImage";
import { Button } from "@/components/ui/button";
import { CheckCircle, Zap } from "lucide-react";
import Link from "next/link";

export const HeroSection: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white to-gray-50 py-20 dark:from-background dark:to-background md:py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div className="flex flex-col gap-6">
            <div className="inline-flex w-fit items-center rounded-full border border-transparent bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary hover:bg-primary/20">
              <Zap className="mr-1 h-3.5 w-3.5" />
              Powered by AI
            </div>
            <h1 className="text-4xl font-bold tracking-tighter md:text-5xl lg:text-6xl">
              Transform Your Media{" "}
              <span className="text-primary">Effortlessly</span>
            </h1>
            <p className="max-w-[600px] text-gray-600 dark:text-gray-400 md:text-xl">
              Compress videos, remove backgrounds, and resize images for social
              media - all with the power of AI. Start with 2 free credits today.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button size="lg" asChild>
                <Link href="/sign-up">Get Started Free</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#learnmore">Learn More</Link>
              </Button>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4 text-primary" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4 text-primary" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
          <div className="relative flex items-center justify-center lg:h-[600px]">
            <HeroImage />
          </div>
        </div>
      </div>
    </section>
  );
};
