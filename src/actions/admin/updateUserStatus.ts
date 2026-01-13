"use server";
import prisma from "@/db";

export async function toggleUserBlock(userId: string) {
  try {
    await prisma.$transaction(async (txn) => {
      const user = await txn.user.findUnique({
        where: { id: userId },
        select: { isBlocked: true },
      });

      if (!user) throw new Error("User not found");
      await txn.user.update({
        where: { id: userId },
        data: {
          isBlocked: !user.isBlocked,
          blockedAt: user.isBlocked ? null : new Date(),
        },
      });
    });
  } catch (error) {
    throw error;
  }
}
