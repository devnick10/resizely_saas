import { useEffect, useState } from "react";

export function useOrderId() {
  const [orderId, setOrderId] = useState<string | null>(null);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    const fetchOrderId = async () => {
      try {
        const response = await fetch("/api/order", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ amount: 50000 }), // ₹500 * 100
        });

        if (!response.ok) {
          throw new Error("Failed to create order");
        }

        const data = await response.json();
        setOrderId(data.orderId);
      } catch (err) {
        console.error("Order fetch failed:", err);
        setError(true);
      }
    };

    fetchOrderId();
  }, []);

  return { orderId, error };
}
