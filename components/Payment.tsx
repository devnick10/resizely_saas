"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import { usePayment } from "@/hooks/usePayment";
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay: any;
  }
}

function Payment() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>();
  const { data } = useSession();

  const { options, paymentError, message } = usePayment(data?.user?.name, data?.user?.email)
  
  const processPayment = async () => {
    setLoading(true);
    try {
      if (!data?.user) {
        return;
      }

      if (!window.Razorpay) {
        toast.error("Razorpay SDK failed to load. Please refresh and try again.");
        setLoading(false);
        return;
      }

      if (paymentError) {
        toast.error(message || "Internal server error.")
        setError(message)
        return
      }

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

    } catch (error) {
      setError(error)
      toast.error("Error processing payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!data || !data.user) return null;
  if (error) {
    toast.error("Sorry for inconvenience")
  }

  return (
    <>

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
