"use server";

import { deleteUserWithAssets } from "@/lib/data/admin/deleteUser";
import { revalidatePath } from "next/cache";

export async function deleteUserAction(userId: string) {
  try {
    await deleteUserWithAssets(userId);
    revalidatePath("/admin/users");
  } catch (error) {
    console.error(error);
    throw new Error("Faild to delete user and assets!");
  }
}
