import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/db";

export async function GET() {
  try {

    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
      include: { Credit: true }, 
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userCredits = user.Credit[0]; // Assuming one Credit record per user

    if (!userCredits) {
      return NextResponse.json({ error: "Insufficient credits" }, { status: 404 });
    }

    return NextResponse.json({ credits: userCredits.credits });

  } catch (error) {
    return NextResponse.json({ error: "Something went wrong",errors:error }, { status: 500 });
  }
}
