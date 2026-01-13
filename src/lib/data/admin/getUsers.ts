import prisma from "@/db";
import { ROLE } from "@prisma/client";
import "server-only";
import { getAdmin } from "./getAdmin";

export type AdminUserRow = {
  id: string;
  username: string;
  email: string;
  isBlocked: boolean;
  role: ROLE;
  credits: number;
  createdAt: Date;
};

export async function getUsersAdmin() {
  const admin = await getAdmin();

  if (admin.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
      isBlocked: true,
      blockedAt: true,
      blockedBy: true,
      createdAt: true,
      Credit: {
        select: {
          credits: true,
        },
      },
    },
  });

  return users.map((u) => ({
    id: u.id,
    username: u.username,
    email: u.email,
    isBlocked: u.isBlocked,
    role: u.role,
    credits: u.Credit?.credits ?? 0,
    createdAt: u.createdAt,
  })) satisfies AdminUserRow[];
}
