import Razorpay from "razorpay";
import { NextResponse, NextRequest } from "next/server";
import { orderValidation } from "@/schema";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const amount = orderValidation(data);
    const keyId = process.env.RAZOR_PAY_KEY_ID;
    const keySecret = process.env.RAZOR_KEY_SECRET;

    if (!keyId || !keySecret) {
      return NextResponse.json(
        { error: "Razorpay keys are not defined" },
        { status: 500 },
      );
    }

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const options = {
      amount: Number(amount),
      currency: "INR",
      receipt: "receipt#1",
    };

    const order = await razorpay.orders.create(options);
    return NextResponse.json({ orderId: order.id }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Payment failed", error },
      { status: 500 },
    );
  }
}
