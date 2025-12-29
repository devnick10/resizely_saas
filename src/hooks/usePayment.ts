"use client";

import { useUserStore } from "@/stores/hooks";
import { useCallback, useEffect, useRef, useState } from "react";
import { createOrderId } from "../helper/createOrderId";

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

interface UsePaymentCallbacks {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}

interface UsePaymentResult {
  isLoading: boolean;
  error: unknown | null;
  options: PaymentOptions | null;
  startPayment: () => void;
}

export function usePayment(
  plan: number | null,
  callbacks: UsePaymentCallbacks = {},
): UsePaymentResult {
  const { user } = useUserStore((state) => state);

  const [options, setOptions] = useState<PaymentOptions | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<unknown | null>(null);

  // use ref to store callbacks to avoid effect dependency
  const callbacksRef = useRef(callbacks);
  callbacksRef.current = callbacks;

  useEffect(() => {
    if (!plan) return;

    let isMounted = true;

    async function initPayment() {
      try {
        setIsLoading(true);

        const { orderId, error: orderError } = await createOrderId(
          Number(plan),
        );

        if (!orderId || orderError) {
          throw new Error("Order creation failed");
        }

        const verifyPaymentHandler = async (response: VerifyPaymentHandler) => {
          try {
            const res = await fetch("/api/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                razorpaySignature: response.razorpay_signature,
                plan,
              }),
            });

            const result = await res.json();

            if (!result.isOk) {
              throw new Error("Payment verification failed");
            }

            callbacksRef.current.onSuccess?.();
          } catch (err) {
            setError(err);
            callbacksRef.current.onError?.(err);
          }
        };

        if (isMounted) {
          setOptions({
            key: process.env.NEXT_PUBLIC_RAZOR_PAY_KEY_ID!,
            amount: String(plan),
            currency: "INR",
            name: "Resizely",
            description: "Buy credits",
            order_id: orderId,
            handler: verifyPaymentHandler,
            prefill: {
              name: user?.name ?? "Guest",
              email: user?.email ?? "guest@example.com",
            },
            theme: { color: "#3399cc" },
          });
        }
      } catch (err) {
        if (isMounted) setError(err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    initPayment();

    return () => {
      isMounted = false;
    };
  }, [plan, user]);

  const startPayment = useCallback(() => {
    // @ts-ignore Razorpay injected globally
    if (!options || !window.Razorpay) return;
    // @ts-ignore Razorpay injected globally
    const razorpay = new window.Razorpay(options);
    razorpay.open();
  }, [options]);

  return {
    isLoading,
    error,
    options,
    startPayment,
  };
}
