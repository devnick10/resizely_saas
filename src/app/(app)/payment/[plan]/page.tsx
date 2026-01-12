"use client";

import { Loader } from "@/components/core/Loader";
import { Button } from "@/components/ui/button";
import { usePayment } from "@/hooks/usePayment";
import { useCreditsStore } from "@/stores/hooks";
import { Plan } from "@/types";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";

export default function Page() {
  const { setCredits, credits } = useCreditsStore((state) => state);
  const { plan } = useParams<{ plan: string }>();
  const { data } = useSession();
  const router = useRouter();

  const numericPlan = Number(plan);
  const isValidPlan = numericPlan === Plan.Standard || numericPlan === Plan.Pro;

  const PLAN_CREDITS: Record<Plan, number> = {
    [Plan.Standard]: 20,
    [Plan.Pro]: 60,
  };
  const creditsIncrementBy = PLAN_CREDITS[numericPlan as Plan] ?? 0;

  // always call hook, handle invalid plan inside
  const { isLoading, error, startPayment } = usePayment(numericPlan, {
    onSuccess: () => {
      toast.success("Payment successful 🎉");
      setCredits(credits + creditsIncrementBy);
      router.replace("/dashboard");
    },
    onError: () => {
      toast.error("Payment failed!");
    },
  });

  // redirect if plan invalid
  useEffect(() => {
    if (!isValidPlan) {
      router.replace("/payment");
    }
  }, [isValidPlan, router]);

  // show error toast
  useEffect(() => {
    if (error) toast.error("Payment initialization failed");
  }, [error]);

  if (!isValidPlan) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader />
      </div>
    );
  }

  const handlePay = () => {
    if (!data?.user) {
      toast.error("Please login first");
      router.push("/sign-in");
      return;
    }
    startPayment();
  };

  return (
    <div className="container mx-auto flex flex-col items-center p-6">
      <h1 className="mb-4 text-xl font-bold">Complete Payment</h1>
      <Button onClick={handlePay} disabled={isLoading}>
        {isLoading ? "Preparing..." : "Pay Now"}
      </Button>
    </div>
  );
}
