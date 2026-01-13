import { cache } from "react";
import { requireUser } from "./require-user";
import "server-only";
import prisma from "@/db";

export const getUser = cache(async () => {
  const user = await requireUser();
  const dbuser = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      id: true,
      email: true,
      username: true,
      profileImage: true,
      role: true,
    },
  });
  if (!dbuser) throw new Error("Unauthorize");
  return dbuser;
});
