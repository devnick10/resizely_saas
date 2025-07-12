import { z } from "zod";

export interface Video {
  id: string;
  title: string;
  description?: string | null;
  publicId: string;
  originalSize: string;
  compressSize: string;
  duration: number;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export const credentialsSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  username: z
    .string()
    .min(6, { message: "username must be at least 6 characters." })
    .max(30)
    .optional(),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." })
    .max(30),
});

export type CredentialsType = z.infer<typeof credentialsSchema>;
