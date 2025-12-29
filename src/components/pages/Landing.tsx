import { Footer } from "@/components/core/Footer";
import { Header } from "@/components/core/header";
import React from "react";
import { CtaSection } from "../landing/CtaSection";
import { FeaturesSection } from "../landing/FeaturesSection";
import { HeroSection } from "../landing/HeroSection";
import { HowItsWorkSection } from "../landing/HowItsWorkSection";
import { PricingSection } from "../landing/PaymentSection";

export const Landing: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col bg-white text-black transition-colors dark:bg-background dark:text-white">
      <Header />
      <HeroSection />
      <FeaturesSection />
      <HowItsWorkSection />
      <PricingSection />
      <CtaSection />
      <Footer />
    </div>
  );
};
