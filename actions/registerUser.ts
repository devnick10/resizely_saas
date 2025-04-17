'use server'

import bcrypt from 'bcrypt'
import prisma from '@/db'
import { credentialsSchema } from '@/types'

interface RegisterUserInput {
    email: string;
    password: string;
    username: string;
}

export async function registerUser({
    email,
    password,
    username,
}: RegisterUserInput) {

    const { success, data } = credentialsSchema.safeParse({ email, password, username })

    if (!success) {
        throw new Error("Invalid creadentials")
    }

    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
        throw new Error('User already exists')
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    try {
        const user = await prisma.$transaction(async (tx) => {
            const user = await tx.user.create({
                data: {
                    email: data.email,
                    username: data.username || data.email.split("@")[0],
                    password: hashedPassword
                },
            });
            await tx.credit.create({
                data: {
                    userId: user.id
                },
            });

            return user;
        });

        return { success: true, user }


    } catch (error) {
        console.error("Signup failed:", error)
        throw new Error("Signup failed");
    }
}
