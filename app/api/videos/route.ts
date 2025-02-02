import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export  async function GET(request: NextRequest) {
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
