import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle, Zap } from "lucide-react";
import FeatureCard from "@/components/Feature-card";
import Header from "@/components/header";
import Footer from "@/components/Footer";
import HeroImage from "@/components/Hero-image";
import PricingCard2 from "../ui/pricing-card";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-background text-black dark:text-white transition-colors">
      <Header />

      {/* Hero Section */}
      <section className="relative py-20 md:py-20 overflow-hidden bg-gradient-to-b from-white to-gray-50 dark:from-background dark:to-background">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col gap-6">
              <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold border-transparent bg-primary/10 text-primary hover:bg-primary/20 w-fit">
                <Zap className="h-3.5 w-3.5 mr-1" />
                Powered by AI
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter">
                Transform Your Media{" "}
                <span className="text-primary">Effortlessly</span>
              </h1>
              <p className="text-gray-600 dark:text-gray-400 md:text-xl max-w-[600px]">
                Compress videos, remove backgrounds, and resize images for
                social media - all with the power of AI. Start with 2 free
                credits today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
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
            <div className="relative lg:h-[600px] flex items-center justify-center">
              <HeroImage />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white dark:bg-background">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Powerful Features
            </h2>
            <p className="text-gray-600 dark:text-gray-400 md:text-lg max-w-[800px] mx-auto">
              Resizely combines cutting-edge AI with intuitive design to make
              media processing simple and efficient.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
      <section id="learnmore" className="py-20 bg-gray-50 dark:bg-muted/50">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-gray-600 dark:text-gray-400 md:text-lg max-w-[800px] mx-auto">
              Resizely makes media processing simple with just three easy steps.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((step, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-muted p-8 rounded-lg shadow-sm border border-gray-100 dark:border-gray-800 text-center"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-primary font-bold text-xl">{step}</span>
                </div>
                <h3 className="text-xl font-bold mb-3">
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
      <section id="pricing" className="py-20 bg-white dark:bg-background">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Simple Credit-Based Pricing
            </h2>
            <p className="text-gray-600 dark:text-gray-400 md:text-lg max-w-[800px] mx-auto">
              Start with 2 free credits. Purchase more credits as you need them.
              No subscriptions or hidden fees.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <PricingCard2
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
            <PricingCard2
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
            <PricingCard2
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
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Need more credits? Contact us for custom enterprise packages.
            </p>
            <Button variant="link" asChild>
              <Link href="#">Contact Sales</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-white">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="text-center max-w-[800px] mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Transform Your Media?
            </h2>
            <p className="text-primary-foreground/80 md:text-lg mb-8">
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
}
