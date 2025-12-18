"use server";
import prisma from "@/db";
import { emailValidation } from "@/schema";

export async function verifyOtp(
  email: string,
  inputOtp: string,
): Promise<{ success: boolean }> {
  emailValidation(email);
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user?.otpExpiresAt) {
    return {
      success: false,
    };
  }

  if (user.otp !== inputOtp) {
    return {
      success: false,
    };
  }

  if (new Date() > user.otpExpiresAt) {
    return {
      success: false,
    };
  }

  await prisma.user.update({
    where: { email },
    data: {
      otp: null,
      otpExpiresAt: null,
    },
  });

  return {
    success: true,
  };
}
