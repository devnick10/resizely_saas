import bcrypt from "bcrypt";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/db";
import { JWT } from "next-auth/jwt";
import { Account, Session } from "next-auth";
import { CredentialsType, credentialsSchema } from "@/types";
import GoogleProvider from "next-auth/providers/google";
import { User } from "next-auth";
declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            name?: string;
            email?: string;
            image?: string;
        };
    }
}

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "Email", required: true },
                username: { label: "Username", type: "text", placeholder: "Username", },
                password: { label: "Password", type: "password", placeholder: "Password", required: true }
            },
            async authorize(credentials: CredentialsType | undefined) {

                const { success, data } = credentialsSchema.safeParse(credentials)

                if (!success) {
                    throw new Error("Missing email or password");
                }

                const existingUser = await prisma.user.findUnique({
                    where: { email: data.email }
                });


                if (!existingUser) {
                    throw new Error("No user found with this email.");
                }

                if (existingUser) {
                    if (existingUser.password) {

                        const isPasswordValid = await bcrypt.compare(data.password, existingUser.password);
                        if (!isPasswordValid) {
                            throw new Error("Invalid credentials");
                        }

                        return {
                            id: existingUser.id,
                            username: existingUser.username,
                            email: existingUser.email
                        }
                    };
                }

                const hashedPassword = await bcrypt.hash(data.password, 10);

                try {

                    const { user } = await prisma.$transaction(async (tx) => {
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

                        return { user };
                    });

                    return {
                        id: user.id,
                        name: user.username,
                        email: user.email
                    };
                } catch (error) {
                    console.error(error)
                    throw new Error("Failed to create user");
                }
            }
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || ""
        })
    ],
    secret: process.env.NEXTAUTH_SECRET || "secret",
    callbacks: {
        async signIn({ user, account }: { user: User; account: Account | null }): Promise<boolean> {
            if (account?.provider === "google") {
                try {
                    const existingUser = await prisma.user.findUnique({
                        where: { email: user.email! },
                    });

                    if (!existingUser) {
                        await prisma.$transaction(async (tx) => {
                            const dbUser = await tx.user.create({
                                data: {
                                    email: user.email!,
                                    username:
                                        user.name?.split(" ").join("_").toLowerCase() ||
                                        user.email!.split("@")[0],
                                    profileImage: user.image,
                                },
                            });

                            await tx.credit.create({
                                data: {
                                    userId: dbUser.id,
                                },
                            });
                        });
                    }
                } catch (error) {
                    console.error("Error during Google sign-in:", error);
                    return false;
                }
            }

            return true;
        },
        async session({ token, session }: { token: JWT; session: Session }) {
            if (session.user) {
                session.user.id = token.sub || "";
            }
            return session;
        }
    },
    pages: {
        signIn: "/sign-in",
        signUp: "/sign-up"
    }
};
