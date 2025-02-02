import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const generatedSignature = (
  razorpayOrderId: string,
  razorpayPaymentId: string
) => {
  const keySecret = process.env.RAZOR_KEY_SECRET;
  if (!keySecret) throw new Error("Razorpay key secret is not defined.");
  return crypto
    .createHmac("sha256", keySecret)
    .update(razorpayOrderId + "|" + razorpayPaymentId)
    .digest("hex");
};

export async function POST(request: NextRequest) {
  const { orderCreationId, razorpayPaymentId, razorpaySignature } =
    await request.json();
  const signature = generatedSignature(orderCreationId, razorpayPaymentId);

  if (signature !== razorpaySignature) {
    return NextResponse.json(
      { message: "Payment verification failed", isOk: false },
      { status: 400 }
    );
  }

  const { userId } = await auth();
  if (!userId)
    return NextResponse.json(
      { message: "Unauthorized", isOk: false },
      { status: 401 }
    );

  try {
    // Check if user has a credit entry, else create one

    const dbUser = await prisma.user.findUnique({
      where: { clerkUserId: userId },
      include: { Credit: true }, // Include the Credit relation to get the user's credits
    });

    if (!dbUser || !dbUser.Credit) {
      return NextResponse.json(
        { error: "User or credits not found" },
        { status: 404 }
      );
    }


    const userCredits = dbUser.Credit[0];

    let updatedCredits;
    if (userCredits) {
      // Update existing credits
      updatedCredits = await prisma.credit.update({
        where: {id:userCredits.id },
        data: { credits: userCredits.credits + 10 },
      });
    } else {
      // Create a new credit record for the user
      updatedCredits = await prisma.credit.create({
        data: { userId:Number(userId), credits: 10 },
      });
    }
     
    if (!updatedCredits) {
        return NextResponse.json({message:"credit's update failed"},{status:500})
    }

    
    return NextResponse.json(
      { message: "Payment verified successfully", isOk: true,updatedCredits:updatedCredits.credits},
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to update credits", isOk: false ,error},
      { status: 500 }
    );
  }
}
