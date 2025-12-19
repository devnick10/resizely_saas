"use client";
import { useCreditsStore, useUserStore } from "@/stores/hooks";
import { Plan } from "@/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { createOrderId } from "../helper/createOrderId";

interface UserPayment {
  plan: Plan;
}

interface VerifyPaymentHandler {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface PaymentOptions {
  key: string;
  amount: string;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: VerifyPaymentHandler) => Promise<void>;
  prefill: {
    name: string;
    email: string;
  };
  theme: {
    color: string;
  };
}

interface UsePaymentResult {
  loading: boolean;
  paymentError: boolean;
  options: PaymentOptions | null;
  message: string | undefined;
}

export function usePayment({ plan }: UserPayment): UsePaymentResult {
  const { setCredits } = useCreditsStore((state) => state);
  const { user } = useUserStore((state) => state);

  const [options, setOptions] = useState<PaymentOptions | null>(null);
  const [paymentError, setPaymentError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string>();

  const router = useRouter();

  useEffect(() => {
    const fetchOrder = async () => {
      const { orderId, error: orderError } = await createOrderId(plan);

      if (!orderId || orderError) {
        setPaymentError(true);
        setMessage("Failed to create Razorpay order");
        setLoading(false);
        return;
      }

      const verifyPaymentHandler = async (response: VerifyPaymentHandler) => {
        try {
          const result = await fetch("/api/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              orderCreationId: orderId,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature,
              plan: plan,
            }),
          });

          const res = await result.json();

          if (!res.isOk) {
            setMessage(res.message || "Payment verification failed");
            setPaymentError(true);
            return;
          }

          router.push("/home");
          setCredits(res.updatedCredits);
          toast.success("Payment succeeded!");
        } catch (err) {
          console.error(err);
          setMessage("An error occurred during verification");
          setPaymentError(true);
        }
      };

      const paymentOptions = {
        key: process.env.NEXT_PUBLIC_RAZOR_PAY_KEY_ID!,
        amount: String(plan),
        currency: "INR",
        name: "Resizly",
        description: "Buy credits",
        order_id: orderId,
        handler: verifyPaymentHandler,
        prefill: {
          name: user?.name || "Guest",
          email: user?.email || "guest@example.com",
        },
        theme: { color: "#3399cc" },
      };

      setOptions(paymentOptions);
      setLoading(false);
    };

    fetchOrder();
  }, [user, plan, router, setCredits]);

  return { message, loading, paymentError, options };
}
