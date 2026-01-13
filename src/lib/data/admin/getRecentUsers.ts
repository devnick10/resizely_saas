import prisma from "@/db";
import "server-only";
import { getAdmin } from "./getAdmin";

export async function getRecentUsers(limit = 10) {
  await getAdmin();

  return prisma.user.findMany({
    take: limit,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
      createdAt: true,
      Credit: {
        select: {
          credits: true,
        },
      },
    },
  });
}
