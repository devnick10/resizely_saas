import "server-only";
import prisma from "@/db";
import { throwServerError } from "@/helper/serverError";
import { unstable_cache } from "next/cache";
import { getUser } from "./getUser";

export const getCredits = async () => {
  const user = await getUser();

  const cachedCredits = unstable_cache(
    async () => {
      try {
        const userCredits = await prisma.credit.findFirst({
          where: { userId: user.id },
        });

        if (!userCredits) {
          throwServerError(null, "User credits not found!");
        }

        return userCredits.credits;
      } catch (error) {
        throwServerError(error, "Failed to fetch user credits");
      }
    },
    [`credits_${user.id}`],
    {
      tags: [`credits_${user.id}`],
    },
  );
  return cachedCredits();
};
