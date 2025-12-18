import "server-only";

import { requireUser } from "./require-user";

export async function getUser() {
  return await requireUser();
}
