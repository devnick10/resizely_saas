"use server";
import prisma from "@/db";
import { getUser } from "./getUser";

export async function updateCredits() {
  try {
    const { email } = await getUser();
    if (!email) {
      return { error: "Unauthorized" };
    }

    const dbUser = await prisma.user.findUnique({
      where: { email },
      include: { Credit: true },
    });

    if (!dbUser) {
      return { success: false, error: "User or credits not found" };
    }

    const userCredits = dbUser.Credit[0];

    if (userCredits.credits <= 0) {
      return { success: false, error: "Not enough credits" };
    }

    const updatedCredit = await prisma.credit.update({
      where: { id: userCredits.id }, // where clause throw error while get create by userid cause use 2 queries
      data: {
        credits: { decrement: 1 },
      },
    });

    return { success: true, credits: updatedCredit.credits };
  } catch (error) {
    return { error, success: true, message: "Something went wrong" };
  }
}
