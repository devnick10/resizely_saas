"use client";

import { useState, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useCreditContext } from "@/context";
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay: any;
  }
}

function Payment() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>();
  const { user } = useUser();
  const router = useRouter();
  const { setCredits } = useCreditContext();

  if (!user) return null;

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const createOrderId = useCallback(async () => {
    try {
      const response = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: 50000 }), // ₹500 * 100 for paise
      });

      if (!response.ok) {
        throw new Error("Failed to create order. Please try again.");
      }

      const data = await response.json();
      return data.orderId;
    } catch (error) {
      setError(error)
      toast.error("Error creating order.");
      return null;
    }
  }, []);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const processPayment = useCallback(async () => {
    setLoading(true);

    try {
      const orderId = await createOrderId();
      if (!orderId) {
        setLoading(false);
        return;
      }

      if (!window.Razorpay) {
        toast.error("Razorpay SDK failed to load. Please refresh and try again.");
        setLoading(false);
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZOR_PAY_KEY_ID!,
        amount: 50000, // ₹500 * 100 for paise
        currency: "INR",
        name: "Resizly",
        description: "Buy credits",
        order_id: orderId,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        handler: async function (response: any) {
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
            if (res.isOk) {
              router.push("/home");
              setCredits(res.updatedCredits);
              toast.success("Payment succeeded!");
            } else {
              toast.error(res.message);
            }
          } catch (error) {
            setError(error)
            toast.error("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: user?.username || "Guest",
          email: user?.emailAddresses[0]?.emailAddress || "guest@example.com",
        },
        theme: { color: "#3399cc" },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      setError(error)
      toast.error("Error processing payment. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [createOrderId, setCredits, router, user]);
  if (error) {
    toast.error("Sorry for inconvenience")
  }
  return (
    <>

       <div>Enternal Servar Error</div> :
        <div className="container flex flex-col items-center justify-center p-4">
          <div className="bg-white shadow-lg rounded-2xl p-6 text-center w-full max-w-sm">
            <h2 className="text-2xl font-semibold text-primary mb-4">Buy Credits</h2>
            <p className="text-gray-600">
              Get <span className="font-bold">10 Credits</span> for just
            </p>
            <p className="text-3xl font-bold text-blue-600 my-3">₹500</p>

            <button
              onClick={processPayment}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl shadow-md w-full flex items-center justify-center"
            >
              {loading ? <Loader2 className="animate-spin w-5 h-5 mr-2" /> : "Buy Now"}
            </button>
          </div>
        </div>
    </>
  );
}

export default Payment;
