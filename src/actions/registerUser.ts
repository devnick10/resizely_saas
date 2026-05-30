"use server";

import prisma from "@/db";
import { credentialsSchema } from "@/schema";
import { RegisterUserInput } from "@/types";
import bcrypt from "bcrypt";

type RegisterUserResponse =
  | { success: true }
  | { success: false; error: string };

export async function registerUser({
  email,
  password,
  username,
}: RegisterUserInput): Promise<RegisterUserResponse> {
  const result = credentialsSchema.safeParse({ email, password, username });
  if (!result.success) {
    return { success: false, error: "Invalid inputs" };
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return { success: false, error: "User already exists" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: email,
          username: username || email.split("@")[0],
          password: hashedPassword,
        },
      });
      await tx.credit.create({
        data: {
          userId: user.id,
        },
      });
    });

    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Registration failed" };
  }
}
