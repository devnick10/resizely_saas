import "server-only";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { cache } from "react";
import { authOptions } from "../../authOptions";
import { User } from "@/types";

export const requireUser = cache(async (): Promise<User> => {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/sign-in");
  }

  return session.user;
});
