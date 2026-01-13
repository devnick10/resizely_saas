import "server-only";
import prisma from "@/db";
import dayjs from "dayjs";
import { getAdmin } from "./getAdmin";

export async function getDailyUploads(days = 7) {
  await getAdmin();

  const result = await Promise.all(
    [...Array(days)].map(async (_, i) => {
      const start = dayjs().subtract(i, "day").startOf("day");
      const end = start.add(1, "day");

      const [images, videos] = await Promise.all([
        prisma.image.count({
          where: {
            createdAt: {
              gte: start.toDate(),
              lt: end.toDate(),
            },
          },
        }),
        prisma.video.count({
          where: {
            createdAt: {
              gte: start.toDate(),
              lt: end.toDate(),
            },
          },
        }),
      ]);

      return {
        date: start.format("DD MMM"),
        images,
        videos,
      };
    }),
  );

  return result.reverse();
}
