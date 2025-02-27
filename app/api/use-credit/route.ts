import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import prisma from '@/db';

export async function GET() {
  try {
    // Fetch the current userId from Clerk
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch the user and their credits from the database
    const dbUser = await prisma.user.findUnique({
      where: { clerkUserId: userId },
      include: { Credit: true }, // Include the Credit relation to get the user's credits
    });

    // If no user found or no credits
    if (!dbUser || !dbUser.Credit || dbUser.Credit.length === 0) {
      return NextResponse.json({ error: 'User or credits not found' }, { status: 404 });
    }

    const userCredits = dbUser.Credit[0]; // Assuming a user can only have one Credit entry

    // Check if the user has enough credits
    if (userCredits.credits <= 0) {
      return NextResponse.json({ error: 'Not enough credits' }, { status: 403 });
    }

    // Deduct one credit for the service
    const updatedCredit =  await prisma.credit.update({
      where: { id: userCredits.id },
      data: {
        credits: { decrement: 1 }, // Decrease by 1 credit
      },
    });

    // Additional service logic can go here (e.g., image processing)

    return NextResponse.json({ message: 'Service used successfully',credit:updatedCredit.credits},{status:200},);
  } catch (error) {
    return NextResponse.json({ error: 'Something went wrong',errors:error }, { status: 500 });
  }
}
