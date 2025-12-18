import "server-only";
import prisma from "@/db";
import { getUser } from "./getUser";

export async function getCredits() {
  const { email } = await getUser();
  if (!email) {
    return {
      success: false,
      error: "Email not found",
    };
  }

  try {
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

    return {
      success: true,
      credits: userCredits.credits,
    };
  } catch (error) {
    return {
      error,
      success: false,
      message: "Failed to fetch user credits",
    };
  }
}
