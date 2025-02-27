import Razorpay from "razorpay";
import { NextResponse, NextRequest } from "next/server";


const razorpay = new Razorpay({
  key_id: process.env.RAZOR_PAY_KEY_ID as string,
  key_secret: process.env.RAZOR_KEY_SECRET as string,
});


export async function POST(request: NextRequest) {
  try {
     
    const {amount} = (await request.json()) as {
      amount: string;
    };
    

    if (!amount) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

   
    const options = {
      amount: Number(amount),
      currency: "INR",
      receipt: 'receipt#1',
     };

     const order = await razorpay.orders.create(options);
     return NextResponse.json({ orderId: order.id }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: "Payment failed", }, { status: 500 });
  }
}
