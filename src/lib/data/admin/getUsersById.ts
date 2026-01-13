import prisma from "@/db";
import "server-only";
import { getAdmin } from "./getAdmin";

export async function getUserByIdAdmin(userId: string) {
  const admin = await getAdmin();

  if (!admin || admin.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
      isBlocked: true,
      blockedAt: true,
      createdAt: true,
      Credit: {
        select: { credits: true },
      },
      _count: {
        select: {
          images: true,
          videos: true,
        },
      },
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
}
