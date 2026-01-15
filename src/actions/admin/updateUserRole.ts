"use server";

import prisma from "@/db";
import { getAdmin } from "@/lib/data/admin/getAdmin";
import { ROLE } from "@prisma/client";

export async function changeUserRole(userId: string, role: ROLE) {
  const admin = await getAdmin();
  if (admin.id === userId) {
    throw new Error("You cannot change your own role");
  }

  try {
    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { role },
      }),
      prisma.auditLog.create({
        data: {
          action: "ROLE_CHANGE",
          adminId: admin.id,
          targetId: userId,
        },
      }),
    ]);
  } catch (error) {
    throw error;
  }
}
