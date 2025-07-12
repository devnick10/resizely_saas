"use server";
import prisma from "@/db";

export async function verifyOtp(
  email: string,
  inputOtp: string,
): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (
    !user ||
    !user.otp ||
    !user.otpExpiresAt ||
    user.otp !== inputOtp ||
    new Date() > user.otpExpiresAt
  ) {
    return false;
  }

  await prisma.user.update({
    where: { email },
    data: {
      otp: null,
      otpExpiresAt: null,
    },
  });

  return true;
}
