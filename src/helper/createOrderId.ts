import { throwServerError } from "./serverError";

export async function createOrderId(amount: number): Promise<{
  orderId: string | null;
  error: boolean;
}> {
  try {
    const response = await fetch("/api/order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount: String(amount) }),
    });

    if (!response.ok) {
      throw new Error("Failed to create order");
    }

    const data = await response.json();
    return { orderId: data.orderId, error: false };
  } catch (err) {
    throwServerError(err, "Order fetch failed:");
  }
}
