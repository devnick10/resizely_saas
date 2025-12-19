import React from "react";
import { PricingCard } from "../dashboard/PricingCard";
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay: any;
  }
}

export const Payment: React.FC = () => {
  return (
    <>
      <section id="pricing" className="bg-white py-2">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Simple Credit-Based Pricing
            </h2>
            <p className="mx-auto max-w-[800px] text-gray-500 md:text-lg">
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
              free={true}
            />
            <div>
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
            </div>
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
              pro={true}
            />
          </div>
        </div>
      </section>
    </>
  );
};
