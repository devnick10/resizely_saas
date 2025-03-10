"use server"
import { auth } from "@clerk/nextjs/server";

export async function getUser() {
  const { userId } = await auth();
  return { userId };
}
