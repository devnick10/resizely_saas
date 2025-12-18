import "server-only";
import prisma from "@/db";
import { getUser } from "./getUser";

export async function getCredits() {
  const { email } = await getUser();
  if (!email) {
    throw Error("Faild to fetch user credits");
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { Credit: true },
    });

    const userCredits = user?.Credit[0];

    return {
      credits: userCredits?.credits,
    };
  } catch (error) {
    throw Error(error as string);
  }
}
