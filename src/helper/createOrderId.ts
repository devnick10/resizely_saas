export async function createOrderId(plan: number): Promise<{
  orderId: string | null;
  error: boolean;
}> {
  try {
    const response = await fetch("/api/order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount: plan }),
    });

    if (!response.ok) {
      throw new Error("Failed to create order");
    }

    const data = await response.json();
    return { orderId: data.orderId, error: false };
  } catch (err) {
    console.error("Order fetch failed:", err);
    return { orderId: null, error: true };
  }
}
