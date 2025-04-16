"use client";

import PricingCard from "./Pricing-card";
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay: any;
  }
}

function Payment(){
  
  return (
    <>
      <section id="pricing" className="py-2 bg-white">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple Credit-Based Pricing</h2>
            <p className="text-gray-500 md:text-lg max-w-[800px] mx-auto">
              Start with 2 free credits. Purchase more credits as you need them. No subscriptions or hidden fees.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
}

export default Payment;
