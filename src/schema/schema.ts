import { Plan } from "@/types";
import { TransformationType } from "@prisma/client";
import { z } from "zod";

const credentialsSchema = z.object({
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

const sendOtpSchema = z.object({
  email: z.string().email({ message: "Please provide right email address" }),
});

const deleteVideoSchema = z.object({
  public_id: z.string(),
});

const deleteImageSchema = z.object({
  public_id: z.string(),
  type: z.nativeEnum(TransformationType),
});

const orderSchema = z.object({
  amount: z.string(),
});

const VerifyPaymentSchema = z.object({
  razorpayOrderId: z.string(),
  razorpayPaymentId: z.string(),
  razorpaySignature: z.string(),
  plan: z.nativeEnum(Plan),
});

export {
  credentialsSchema,
  deleteVideoSchema,
  orderSchema,
  sendOtpSchema,
  VerifyPaymentSchema,
  deleteImageSchema,
};

export type VerifyPaymentSchema = z.infer<typeof VerifyPaymentSchema>;
export type CredentialsType = z.infer<typeof credentialsSchema>;
export type DeleteImagePayload = z.infer<typeof deleteImageSchema>;
