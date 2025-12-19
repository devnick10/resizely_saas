"use client";
import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";

interface PricingCardButtonProps {
  buttonText: string;
  buttonVariant: "default" | "outline" | "secondary";
}

export const PricingCardButton: React.FC<PricingCardButtonProps> = ({
  buttonText,
  buttonVariant,
}) => {
  return (
    <Button variant={buttonVariant} className="w-full" asChild>
      <Link href="/payment">{buttonText}</Link>
    </Button>
  );
};
