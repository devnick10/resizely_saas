"use server";

import prisma from "@/db";
import { registerUserValidation } from "@/schema";
import { RegisterUserInput } from "@/types";
import bcrypt from "bcrypt";

export async function registerUser({
  email,
  password,
  username,
}: RegisterUserInput) {

  registerUserValidation({ email, password, username })

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.$transaction(async (tx) => {
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

      return user;
    });

    return { success: true, user };
  } catch (error) {
    console.error("Signup failed:", error);
    throw new Error("Signup failed");
  }
}
