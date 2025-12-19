import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle, Zap } from "lucide-react";
import { FeatureCard } from "@/components/landing/FeatureCard";
import { Header } from "@/components/core/header";
import { Footer } from "@/components/core/Footer";
import { HeroImage } from "@/components/landing/HeroImage";
import { PricingCard } from "../landing/PricingCard";
import React from "react";

export const Landing: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col bg-white text-black transition-colors dark:bg-background dark:text-white">
      <Header />

      {/* Hero Section */}
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
                Compress videos, remove backgrounds, and resize images for
                social media - all with the power of AI. Start with 2 free
                credits today.
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

      {/* Features Section */}
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

      {/* How It Works */}
      <section id="learnmore" className="bg-gray-50 py-20 dark:bg-muted/50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              How It Works
            </h2>
            <p className="mx-auto max-w-[800px] text-gray-600 dark:text-gray-400 md:text-lg">
              Resizely makes media processing simple with just three easy steps.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[1, 2, 3].map((step, idx) => (
              <div
                key={idx}
                className="rounded-lg border border-gray-100 bg-white p-8 text-center shadow-sm dark:border-gray-800 dark:bg-muted"
              >
                <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <span className="text-xl font-bold text-primary">{step}</span>
                </div>
                <h3 className="mb-3 text-xl font-bold">
                  {step === 1
                    ? "Upload Your Media"
                    : step === 2
                      ? "Choose Your Options"
                      : "Download & Share"}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {step === 1
                    ? "Drag and drop your videos or images onto our platform."
                    : step === 2
                      ? "Select compression level, background removal, or social media platform."
                      : "Get your optimized media instantly and share it anywhere."}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="bg-white py-20 dark:bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Simple Credit-Based Pricing
            </h2>
            <p className="mx-auto max-w-[800px] text-gray-600 dark:text-gray-400 md:text-lg">
              Start with 2 free credits. Purchase more credits as you need them.
              No subscriptions or hidden fees.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <PricingCard
              title="Starter"
              price="Free"
              description="Perfect for trying out Resizely"
              features={[
                "2 free credits",
                "1 credit = 1 video compression",
                "1 credit = 1 background removal",
                "1 credit = 5 social media resizes",
                "Credits never expire",
                "Basic support",
              ]}
              buttonText="Get Started"
              buttonVariant="outline"
            />
            <PricingCard
              title="Standard"
              price="$20"
              description="Most popular for individuals"
              features={[
                "20 credits",
                "1 credit = 1 video compression",
                "1 credit = 1 background removal",
                "1 credit = 5 social media resizes",
                "Credits never expire",
                "Priority support",
              ]}
              buttonText="Buy Credits"
              buttonVariant="default"
              popular={true}
            />
            <PricingCard
              title="Pro"
              price="$40"
              description="Best value for professionals"
              features={[
                "60 credits",
                "1 credit = 1 video compression",
                "1 credit = 1 background removal",
                "1 credit = 5 social media resizes",
                "Credits never expire",
                "Priority support",
                "API access",
              ]}
              buttonText="Buy Credits"
              buttonVariant="outline"
            />
          </div>
          <div className="mt-12 text-center">
            <p className="mb-4 text-gray-600 dark:text-gray-400">
              Need more credits? Contact us for custom enterprise packages.
            </p>
            <Button variant="link" asChild>
              <Link href="#">Contact Sales</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary py-20 text-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mx-auto max-w-[800px] text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Ready to Transform Your Media?
            </h2>
            <p className="mb-8 text-primary-foreground/80 md:text-lg">
              Start with 2 free credits and experience the power of
              Resizely&apos;s AI-powered media tools.
            </p>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/sign-up">Get Started for Free</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
