import prisma from "@/db";
import "server-only";
import { getAdmin } from "./getAdmin";

export async function getCreditsOverview() {
  await getAdmin();
  const [totalCredits, usersWithCredits] = await Promise.all([
    prisma.credit.aggregate({
      _sum: {
        credits: true,
      },
    }),
    prisma.credit.count(),
  ]);

  return {
    totalCredits: totalCredits._sum.credits ?? 0,
    usersWithCredits,
  };
}
