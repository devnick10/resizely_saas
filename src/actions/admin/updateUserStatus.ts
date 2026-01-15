"use server";
import prisma from "@/db";
import { getAdmin } from "@/lib/data/admin/getAdmin";

export async function toggleUserBlock(userId: string) {
  const admin = await getAdmin();
  try {
    await prisma.$transaction(async (txn) => {
      const user = await txn.user.findUnique({
        where: { id: userId },
        select: { isBlocked: true },
      });

      if (!user) throw new Error("User not found");
      const updatedUser = await txn.user.update({
        where: { id: userId },
        data: {
          isBlocked: !user.isBlocked,
          blockedAt: user.isBlocked ? null : new Date(),
        },
      });

      const action = updatedUser.isBlocked ? "USER_BLOCK" : "USER_UNBLOCK";
      await txn.auditLog.create({
        data: {
          action: action,
          targetId: updatedUser.id,
          adminId: admin.id,
        },
      });
    });
  } catch (error) {
    throw error;
  }
}
