import React from "react";
import { PricingCard } from "../core/PricingCard";
import { Plan } from "@/types";
import { Button } from "../ui/button";
import Link from "next/link";

export const PricingSection: React.FC = () => {
  return (
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
              "1 credit = 1 image resize",
              "Credits never expire",
              "Basic support",
            ]}
            buttonText="Get Started"
            buttonVariant="outline"
            free={true}
          />
          <PricingCard
            title="Standard"
            price="₹199"
            description="Great for occasional creators"
            features={[
              "20 credits",
              "1 credit = 1 video compression",
              "1 credit = 1 background removal",
              "1 credit = 1 image resize",
              "Credits never expire",
              "Priority support",
            ]}
            buttonText="Buy Credits"
            buttonVariant="default"
            popular={true}
            plan={Plan.Standard}
          />
          <PricingCard
            title="Pro"
            price="₹499"
            description="Best for regular content creators"
            features={[
              "60 credits",
              "1 credit = 1 video compression",
              "1 credit = 1 background removal",
              "1 credit = 1 image resize",
              "Credits never expire",
              "Priority support",
            ]}
            buttonText="Buy Credits"
            buttonVariant="outline"
            plan={Plan.Pro}
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
  );
};
