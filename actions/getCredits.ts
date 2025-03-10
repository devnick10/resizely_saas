"use server"
import prisma from "@/db";

export async function getCredits(userId:string) {
    try {

        
        if (!userId) return {
            success: false,
            error: "Unauthorized"
        }

        const user = await prisma.user.findUnique({
            where: { clerkUserId: userId },
            include: { Credit: true },
        });

        if (!user) {
            return {
                success: false,
                error: "User not found"
            }
        }

        const userCredits = user.Credit[0]; // Assuming one Credit record per user

        if (!userCredits) {
            return {
                success: false,
                error: "Insufficient credits"
            };
        }

        return {
            success: true,
            credits: userCredits.credits
        };

    } catch (error) {
        return {
            error,
            success: false,
            message:"Something went wrong"
        };
    }
}
