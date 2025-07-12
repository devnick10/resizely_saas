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
        email: {
          label: "Email",
          type: "email",
          placeholder: "Email",
          required: true,
        },
        username: { label: "Username", type: "text", placeholder: "Username" },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Password",
          required: true,
        },
      },
      async authorize(
        credentials: CredentialsType | undefined,
      ): Promise<User | null> {
        const { success, data } = credentialsSchema.safeParse(credentials);

        if (!success) {
          return null;
        }

        const existingUser = await prisma.user.findUnique({
          where: { email: data.email },
        });

        if (!existingUser || !existingUser.password) {
          throw new Error("User not found or invalid password setup");
        }

        const isPasswordValid = await bcrypt.compare(
          data.password,
          existingUser.password,
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: existingUser.id,
          name: existingUser.username || existingUser.email.split("@")[0],
          email: existingUser.email,
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({
      user,
      account,
    }: {
      user: User;
      account: Account | null;
    }): Promise<boolean> {
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
    },
  },
  pages: {
    signIn: "/sign-in",
    signUp: "/sign-up",
  },
};
