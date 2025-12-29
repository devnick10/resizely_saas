import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";

export const CtaSection: React.FC = () => {
  return (
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
  );
};
