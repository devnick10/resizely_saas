"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { Plan } from "@/types";
import { usePayment } from "@/hooks/usePayment";
import { Loader } from "@/components/core/Loader";

export const Payment: React.FC = () => {
  const params = useSearchParams();
  const { data } = useSession();
  const router = useRouter();

  const planParam = params.get("plan");
  const plan = Number(planParam) as Plan;

  const { startPayment, isLoading, error } = usePayment(plan);

  useEffect(() => {
    if (error) {
      toast.error("Payment initialization failed");
    }
  }, [error]);

  const handlePay = () => {
    if (!data?.user) {
      toast.error("Please login first");
      router.push("/sign-in");
      return;
    }

    startPayment();
  };

  return (
    <div className="container mx-auto max-w-md p-6">
      <h1 className="mb-6 text-xl font-bold">Complete Payment</h1>

      <button
        disabled={isLoading}
        onClick={handlePay}
        className="w-full rounded-md bg-primary px-4 py-2 text-white disabled:opacity-50"
      >
        {isLoading ? <Loader label="Preparing payment..." /> : "Pay Now"}
      </button>
    </div>
  );
};
