import { useEffect, useState } from "react";
import { useOrderId } from "./useOrderId";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useCreditContext } from "@/context";

interface UsePaymentResult {
  loading: boolean;
  paymentError: boolean;
  options: any | null;
  message: string | undefined;
}

export function usePayment(name?: string, email?: string): UsePaymentResult {
  const [options, setOptions] = useState<any | null>(null);
  const [paymentError, setPaymentError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string>();
  
  const {setCredits} = useCreditContext();
  const { orderId, error: orderError } = useOrderId();
  const router = useRouter()
  useEffect(() => {
    if (!orderId) return;

    if (orderError) {
      setPaymentError(true);
      setMessage("Failed to create Razorpay order");
      setLoading(false);
      return;
    }

    // Handler for verifying payment
    const verifyHandler = async (response: any) => {
      try {
        const result = await fetch("/api/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderCreationId: orderId,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            razorpaySignature: response.razorpay_signature,
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
        setMessage("An error occurred during verification");
        setPaymentError(true);
      }
    };

    const paymentOptions = {
      key: process.env.NEXT_PUBLIC_RAZOR_PAY_KEY_ID!,
      amount: 50000,
      currency: "INR",
      name: "Resizly",
      description: "Buy credits",
      order_id: orderId,
      handler: verifyHandler,
      prefill: {
        name: name || "Guest",
        email: email || "guest@example.com",
      },
      theme: { color: "#3399cc" },
    };

    setOptions(paymentOptions);
    setLoading(false);
  }, [orderId, orderError, name, email]);

  return { message, loading, paymentError, options };
}
