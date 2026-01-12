import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@/db";
import { getUser } from "@/lib/data/user/getUser";
import { Plan } from "@/types";
import { throwServerError } from "@/helper/serverError";
import { revalidateTag } from "next/cache";
import { verifyPaymentRequestValidation } from "@/schema";

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
  const user = await getUser();
  const requestBody = await request.json();
  const { razorpayOrderId, razorpayPaymentId, razorpaySignature, plan } =
    verifyPaymentRequestValidation(requestBody);

  const signature = generatedSignature(razorpayOrderId, razorpayPaymentId);
  if (signature !== razorpaySignature) {
    return NextResponse.json(
      { message: "Payment verification failed", isOk: false },
      { status: 400 },
    );
  }

  try {
    await prisma.$transaction(async (txn) => {
      const dbUser = await txn.user.findUnique({
        where: { id: user.id },
        include: { Credit: true },
      });

      if (!dbUser || !dbUser.Credit || !plan) {
        throwServerError(null, "User not found!");
      }

      if (!plan) {
        throwServerError(null, "Plan not provided!");
      }

      const creditId = dbUser.Credit.id;
      const PLAN_CREDITS: Record<Plan, number> = {
        [Plan.Standard]: 20,
        [Plan.Pro]: 60,
      };
      const creditsIncrementBy = PLAN_CREDITS[plan];

      await txn.credit.update({
        where: { id: creditId },
        data: { credits: { increment: creditsIncrementBy } },
      });
    });

    revalidateTag(`credits_${user.id}`);
    return NextResponse.json(
      {
        message: "Payment verified successfully",
        isOk: true,
      },
      { status: 200 },
    );
  } catch (error) {
    throwServerError(error, "Payment verification failed!");
  }
}
