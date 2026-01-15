"use server";

import { deleteAdminMedia } from "@/lib/data/admin/deleteMedia";
import { revalidatePath } from "next/cache";

export async function deleteMediaAction(id: string, type: "IMAGE" | "VIDEO") {
  try {
    await deleteAdminMedia(id, type);
    revalidatePath("/admin/media");
  } catch (error) {
    console.error(error);
    throw new Error("Failed to delete media!");
  }
}
