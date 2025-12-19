"use client";

import { Button } from "@/components/ui/button";
import { usePayment } from "@/hooks/usePayment";
import { Plan } from "@/types";
import { CheckCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface PricingCardProps {
  title: string;
  price: string;
  description: string;
  features: string[];
  buttonText: string;
  buttonVariant: "default" | "outline" | "secondary";
  popular?: boolean;
  pro?: boolean;
  free?: boolean;
}

export const PricingCard: React.FC<PricingCardProps> = (props) => {
  const { data } = useSession();
  const selectedPlan = props.pro ? Plan.Pro : Plan.Standard;
  const { options, paymentError, message } = usePayment({
    plan: selectedPlan,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>();

  useEffect(() => {
    if (error) {
      toast.error("Sorry for the inconvenience");
    }
  }, [error]);

  const processPayment = async () => {
    setLoading(true);

    try {
      if (!data?.user) return;

      if (!window.Razorpay) {
        toast.error(
          "Razorpay SDK failed to load. Please refresh and try again.",
        );
        return;
      }

      if (paymentError) {
        toast.error(message || "Internal server error.");
        setError(message);
        return;
      }

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      setError(error);
      toast.error("Error processing payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!data?.user) return null;

  return (
    <div
      className={`rounded-lg border bg-white p-8 dark:bg-muted ${
        props.popular
          ? "relative border-primary shadow-lg"
          : "border-gray-200 shadow-sm dark:border-gray-700"
      } flex h-full flex-col transition-colors`}
    >
      {props.popular && (
        <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-primary px-3 py-1 text-xs font-bold text-white">
          Most Popular
        </div>
      )}

      <div className="mb-6">
        <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
          {props.title}
        </h3>
        <div className="mb-2 flex items-baseline">
          <span className="text-3xl font-bold text-gray-900 dark:text-white">
            {props.price}
          </span>
          <span className="ml-1 text-gray-500 dark:text-gray-400">/month</span>
        </div>
        <p className="text-gray-500 dark:text-gray-400">{props.description}</p>
      </div>

      <ul className="mb-8 flex-grow space-y-3">
        {props.features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <CheckCircle className="mr-2 h-5 w-5 shrink-0 text-primary" />
            <span className="text-gray-700 dark:text-gray-200">{feature}</span>
          </li>
        ))}
      </ul>

      <Button
        variant={props.buttonVariant}
        className="w-full"
        onClick={() => {
          if (props.free) {
            return toast.success("You already have free plan.");
          }
          processPayment();
        }}
        disabled={loading}
      >
        {loading ? "Processing..." : props.buttonText}
      </Button>
    </div>
  );
};
