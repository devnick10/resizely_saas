// import { NextRequest, NextResponse } from 'next/server';
// import { auth, currentUser } from '@clerk/nextjs/server';
// import prisma from '@/db';

// export async function POST(request: NextRequest) {
//   try {
    
//     const existingUser = await prisma.user.findUnique({
//       where: {
//         email,  
//       },
//     });

//     if (existingUser) {
//       return NextResponse.json({ message: 'User already exists', user: existingUser }, { status: 200 });
//     }

//     const newUser = await prisma.user.create({
//       data: {
//         email,
//         username,
//       },
//     });

//     await prisma.credit.create({
//       data: {
//         userId: newUser.id,
//       },
//     });

//     return NextResponse.json({ message: 'User created successfully', user: newUser }, { status: 201 });
//   } catch (error) {
//     return NextResponse.json({ error: 'Failed to create user',errors:error }, { status: 500 });
//   }
// }
