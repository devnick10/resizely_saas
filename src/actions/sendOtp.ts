"use server";
import prisma from "@/db";
import { sendMail } from "@/helper/mailer";
import { emailValidation } from "@/schema";

export async function sendOTP(email: string) {
  emailValidation(email);
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // expiry time 5min

  await prisma.user.update({
    where: { email },
    data: {
      otp,
      otpExpiresAt,
    },
  });

  await sendMail(email, otp);
}
