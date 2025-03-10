"use server"
import prisma from "@/db";

export async function getVideos(userId:string) {
    try {
        const videos = await prisma.video.findMany({
            where:{
                userId
            }
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
            message: "Error while fetching videos",
        };
    }
}
