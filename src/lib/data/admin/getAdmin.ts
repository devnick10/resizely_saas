import { cache } from "react";
import "server-only";
import prisma from "@/db";
import { requireUser } from "../user/require-user";
import { redirect } from "next/navigation";

export const getAdmin = cache(async () => {
  const user = await requireUser();
  const admin = await prisma.user.findUnique({
    where: { id: user.id, role: "ADMIN" },
    select: {
      id: true,
      email: true,
      username: true,
      profileImage: true,
      role: true,
    },
  });
  if (!admin || admin.role !== "ADMIN") {
    redirect("/");
  }
  return admin;
});
