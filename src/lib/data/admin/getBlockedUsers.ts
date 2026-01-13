import prisma from "@/db";
import { ROLE } from "@prisma/client";
import "server-only";
import { getAdmin } from "./getAdmin";

export type BlockedUserRow = {
  id: string;
  username: string;
  email: string;
  role: ROLE;
  blockedAt: Date | null;
  credits: number;
};

export async function getBlockedUsersAdmin() {
  await getAdmin();
  const users = await prisma.user.findMany({
    where: {
      isBlocked: true,
    },
    orderBy: {
      blockedAt: "desc",
    },
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
      blockedAt: true,
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
    role: u.role,
    blockedAt: u.blockedAt,
    credits: u.Credit?.credits ?? 0,
  })) satisfies BlockedUserRow[];
}
