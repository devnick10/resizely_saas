import prisma from "@/db";
import { getAdmin } from "./getAdmin";

export type AdminActivityRow = {
  id: string;
  action: string;
  targetId: string | null;
  admin: {
    id: string;
    username: string;
    email: string;
  };
  createdAt: Date;
  meta: any;
};

export async function getActivityLogs(limit = 20) {
  await getAdmin();
  const logs = await prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
    include: {
      admin: {
        select: {
          id: true,
          username: true,
          email: true,
        },
      },
    },
  });

  return logs as AdminActivityRow[];
}
