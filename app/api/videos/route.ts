import { NextResponse } from "next/server";
import prisma from "@/db"

export  async function GET() {
  try {

    const videos = await prisma.video.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!videos) {
      return NextResponse.json({message:"No videos yet."},{status:200})
    }

    return NextResponse.json(videos,{status:200})

  } catch (error) {
     
   return NextResponse.json(
      {
        message: "Error fetching videos",
      },
      { status: 500 }
    );

  } finally {

    await prisma.$disconnect();
  }
}
