"use server";
import prisma from "@/db";
import { sendMail } from "@/helper/mailer";
import { sendOtpSchema } from "@/schema";

type SendOTPResponse = { success: false; error: string } | { success: true };

export async function sendOTP(email: string): Promise<SendOTPResponse> {
  const result = sendOtpSchema.safeParse({ email });
  if (!result.success) {
    return { success: false, error: "Invalid inputs" };
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // expiry time 5min

  try {
    await sendMail(email, otp);
    await prisma.user.update({
      where: { email },
      data: {
        otp,
        otpExpiresAt,
      },
    });
    return { success: true };
  } catch (error) {
    console.error("Failed to send OTP", error);
    return { success: false, error: "Failed to send OTP, Try again!" };
  }
}
