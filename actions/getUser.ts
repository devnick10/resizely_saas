"use server"
import { authOptions } from "@/app/lib/authOptions";
import { getServerSession } from "next-auth";

export async function getUser() {
  const session = await getServerSession(authOptions);
  return { email: session?.user.email };
}
