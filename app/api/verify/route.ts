import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@/db";
import { getUser } from "@/actions/getUser";

const generatedSignature = (
  razorpayOrderId: string,
  razorpayPaymentId: string,
) => {
  const keySecret = process.env.RAZOR_KEY_SECRET;
  if (!keySecret) throw new Error("Razorpay key secret is not defined.");
  return crypto
    .createHmac("sha256", keySecret)
    .update(razorpayOrderId + "|" + razorpayPaymentId)
    .digest("hex");
};

export async function POST(request: NextRequest) {
  const { orderCreationId, razorpayPaymentId, razorpaySignature, plan } =
    await request.json();

  const signature = generatedSignature(orderCreationId, razorpayPaymentId);

  if (signature !== razorpaySignature) {
    return NextResponse.json(
      { message: "Payment verification failed", isOk: false },
      { status: 400 },
    );
  }

  const { email } = await getUser();
  if (!email)
    return NextResponse.json(
      { message: "Unauthorized", isOk: false },
      { status: 401 },
    );

  try {
    const dbUser = await prisma.user.findUnique({
      where: { email },
      include: { Credit: true },
    });

    if (!dbUser || !dbUser.Credit || !plan) {
      return NextResponse.json(
        { error: "User or credits not found" },
        { status: 404 },
      );
    }

    const userCredits = dbUser.Credit[0];
    const incrementValue: number = plan === 171300 ? 20 : 60;

    const updatedCredits = await prisma.credit.update({
      where: { id: userCredits.id },
      data: { credits: { increment: incrementValue } },
    });

    if (!updatedCredits) {
      return NextResponse.json(
        { message: "credit's update failed" },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        message: "Payment verified successfully",
        isOk: true,
        updatedCredits: updatedCredits.credits,
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to update credits", isOk: false, error },
      { status: 500 },
    );
  }
}
