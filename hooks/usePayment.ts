import { useEffect, useState } from "react";
import { createOrderId } from "../helper/createOrderId";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useCreditContext } from "@/context";

export enum Plan {
  Pro = 342700,
  Standard = 171300
}

interface IUserPaymentProps {
  name?: string;
  email?: string;
  plan: Plan;
}

interface UsePaymentResult {
  loading: boolean;
  paymentError: boolean;
  options: any | null;
  message: string | undefined;
}

export function usePayment({ name, email, plan }: IUserPaymentProps): UsePaymentResult {
  const [options, setOptions] = useState<any | null>(null);
  const [paymentError, setPaymentError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string>();

  const { setCredits } = useCreditContext();
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
              plan: Number(plan),
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
        amount: String(plan),
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
    };

    fetchOrder();
  }, [name, email, plan, router, setCredits]);

  return { message, loading, paymentError, options };
}
