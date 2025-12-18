import { requireUser } from "./require-user";
import "server-only";

export async function getUser() {
  return await requireUser();
}
