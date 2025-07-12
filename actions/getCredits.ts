"use server";
import prisma from "@/db";

export async function getCredits(email: string) {
  try {
    if (!email)
      return {
        success: false,
        error: "Unauthorized",
      };

    const user = await prisma.user.findUnique({
      where: { email },
      include: { Credit: true },
    });

    if (!user) {
      return {
        success: false,
        error: "User not found",
      };
    }

    const userCredits = user.Credit[0];

    if (!userCredits) {
      return {
        success: false,
        error: "Insufficient credits",
      };
    }

    return {
      success: true,
      credits: userCredits.credits,
    };
  } catch (error) {
    return {
      error,
      success: false,
      message: "Something went wrong",
    };
  }
}
