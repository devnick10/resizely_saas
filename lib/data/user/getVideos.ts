import "server-only";
import prisma from "@/db";
import { getUser } from "./getUser";

export async function getVideos() {
  const { id } = await getUser();
  try {
    const videos = await prisma.video.findMany({
      where: {
        userId: id,
      },
    });

    if (!videos || videos.length === 0) {
      return {
        success: false,
        data: [],
      };
    }

    return {
      success: true,
      data: videos,
    };
  } catch (error) {
    return {
      error,
      success: false,
      message: "Failed to fetch user videos",
    };
  }
}
