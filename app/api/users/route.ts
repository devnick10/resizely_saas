import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import prisma from '@/db';

export async function POST(request: NextRequest) {
  try {
    const user = await currentUser();
    const {userId} = await auth()
    let email: string;
    let username: string;

    if (user) {
      // Get user details from Clerk (after Google sign-up or any other method)
      email = user.emailAddresses[0].emailAddress;  
      username = user.firstName + " " + user.lastName;  
    } else {

      // Case 2: User provided data via request body (signing up manually)
      const { username: bodyUsername, email: bodyEmail } = await request.json();

      if (!bodyUsername || !bodyEmail) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
      }

      email = bodyEmail;
      username = bodyUsername;
    }

    // Check if the user already exists in the database
    const existingUser = await prisma.user.findUnique({
      where: {
        email,  // Check by email as the unique field
      },
    });

    if (existingUser) {
      return NextResponse.json({ message: 'User already exists', user: existingUser }, { status: 200 });
    }

    const newUser = await prisma.user.create({
      data: {
        clerkUserId: userId || user?.id || "googleuser" ,  // Only for Google/OAuth users, will be null for manual sign-ups
        email,
        username,
      },
    });

    await prisma.credit.create({
      data: {
        userId: newUser.id,
      },
    });

    return NextResponse.json({ message: 'User created successfully', user: newUser }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create user',errors:error }, { status: 500 });
  }
}
