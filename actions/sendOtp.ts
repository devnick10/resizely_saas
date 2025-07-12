"use server";
import { sendMail } from "@/helper/mailer";
import prisma from "@/db";

export async function sendOTP(email: string) {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

  await prisma.user.update({
    where: { email },
    data: {
      otp,
      otpExpiresAt,
    },
  });

  await sendMail(email, otp);
}
