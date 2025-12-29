"use client";

import React from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { Button } from "../ui/button";
import { Plan } from "@/types";

interface PricingCardButtonProps {
  buttonText: string;
  buttonVariant: "default" | "outline" | "secondary";
  free?: boolean;
  plan?: Plan;
}

export const PricingCardButton: React.FC<PricingCardButtonProps> = ({
  buttonText,
  buttonVariant,
  free,
  plan,
}) => {
  if (free) {
    return (
      <Button
        variant={buttonVariant}
        className="w-full"
        onClick={() => toast.success("You already have free plan.")}
      >
        {buttonText}
      </Button>
    );
  }

  if (!plan) {
    return (
      <Button variant={buttonVariant} className="w-full" disabled>
        {buttonText}
      </Button>
    );
  }

  return (
    <Link href={`/payment/${plan}`} className="w-full">
      <Button variant={buttonVariant} className="w-full">
        {buttonText}
      </Button>
    </Link>
  );
};
