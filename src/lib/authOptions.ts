import prisma from "@/db";
import { CredentialsType, credentialsSchema } from "@/schema";
import bcrypt from "bcrypt";
import type { DefaultSession } from "next-auth";
import { Account, AuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
  }
}

export const authOptions: AuthOptions = {
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
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ token, session }) {
      if (session.user) {
        session.user.id = token.id;
      }
      return session;
    },
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
            const createdUser = await prisma.$transaction(async (tx) => {
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
              return dbUser;
            });
            user.id = createdUser.id;
          } else {
            user.id = existingUser.id;
          }
        } catch (error) {
          console.error("Error during Google sign-in:", error);
          return false;
        }
      }
      return true;
    },
  },
  pages: {
    signIn: "/sign-in",
    newUser: "/sign-up",
  },
};
