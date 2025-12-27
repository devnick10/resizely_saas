"use server";
import prisma from "@/db";
import { throwServerError } from "@/helper/serverError";
import { getUser } from "@/lib/data/user/getUser";

export async function verifyOtp(
  inputOtp: string,
): Promise<{ success: boolean }> {
  const user = await getUser();

  try {
    await prisma.$transaction(async (txn) => {
      const dbUser = await txn.user.findUnique({
        where: { id: user?.id },
      });

      if (dbUser?.otp !== inputOtp) {
        throwServerError(null, "Invalid OTP");
      }

      if (dbUser.otpExpiresAt && new Date() > dbUser.otpExpiresAt) {
        throwServerError(null, "OTP expired");
      }

      await txn.user.update({
        where: { id: user.id },
        data: {
          otp: null,
          otpExpiresAt: null,
        },
      });
    });
    return { success: true };
  } catch (error) {
    throwServerError(error, "Faild to validate OTP!");
  }
}
