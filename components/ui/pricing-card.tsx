"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import Link from "next/link";

interface PricingCardProps {
  title: string;
  price: string;
  description: string;
  features: string[];
  buttonText: string;
  buttonVariant: "default" | "outline" | "secondary";
  popular?: boolean;
  pro?: boolean;
  free?:boolean
}

export default function PricingCard2({
  title,
  price,
  description,
  features,
  buttonText,
  buttonVariant,
  popular = false,
}: PricingCardProps) {
  return (
    <div
      className={`bg-white p-8 rounded-lg border ${popular ? "border-primary shadow-lg relative" : "border-gray-200 shadow-sm"
        } flex flex-col h-full`}
    >
      {popular && (
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary text-white text-xs font-bold py-1 px-3 rounded-full">
          Most Popular
        </div>
      )}
      <div className="mb-6">
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <div className="flex items-baseline mb-2">
          <span className="text-3xl font-bold">{price}</span>
          <span className="text-gray-500 ml-1">/month</span>
        </div>
        <p className="text-gray-500">{description}</p>
      </div>
      <ul className="space-y-3 mb-8 flex-grow">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <CheckCircle className="h-5 w-5 text-primary shrink-0 mr-2" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <Button variant={buttonVariant} className="w-full" asChild>
        <Link href="/payment">{buttonText}</Link>
      </Button>
    </div>
  );
}
