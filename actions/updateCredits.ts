"use server";

import prisma from "@/db";
import { getUser } from "../lib/data/user/getUser";

export async function updateCredits() {
  try {
    const { email } = await getUser();

    if (!email) {
      return { success: false, error: "Unauthorized" };
    }

    const result = await prisma.$transaction(async (txn) => {
      const user = await txn.user.findUnique({
        where: { email },
        include: { Credit: true },
      });

      if (!user || user.Credit.length === 0) {
        throw new Error("Credits not found");
      }

      const userCredits = user.Credit[0];
      if (userCredits.credits <= 0) {
        return { success: false, error: "Not enough credits" };
      }

      const updatedCredits = await txn.credit.update({
        where: { id: userCredits.id },
        data: {
          credits: { decrement: 1 },
        },
      });

      return {
        success: true,
        credits: updatedCredits.credits,
      };
    });

    return result;
  } catch (error) {
    console.error("updateCredits error:", error);
    return {
      success: false,
      error: "Something went wrong",
    };
  }
}
