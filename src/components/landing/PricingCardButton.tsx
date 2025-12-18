"use client";
import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";

export default function PricingCardButton({
  buttonText,
  buttonVariant,
}: {
  buttonText: string;
  buttonVariant: "default" | "outline" | "secondary";
}) {
  return (
    <Button variant={buttonVariant} className="w-full" asChild>
      <Link href="/payment">{buttonText}</Link>
    </Button>
  );
}
