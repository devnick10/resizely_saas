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
    await prisma.user.update({
      where: { id: userId },
      data: { role },
    });
  } catch (error) {
    throw error;
  }
}
