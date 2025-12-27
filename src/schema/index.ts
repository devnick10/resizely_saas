import { RegisterUserInput } from "@/types";
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

function emailValidation(email: string) {
  const { success, data, error } = sendOtpSchema.safeParse(email);
  if (!success) {
    throw Error(error.issues[0].message);
  }
  return data.email;
}

function registerUserValidation(user: RegisterUserInput) {
  const { success, data, error } = credentialsSchema.safeParse(user);
  if (!success) {
    throw Error(error.issues[0].message);
  }
  return data;
}

function deleteVideoValidatation(public_id: string) {
  const { success, data, error } = deleteVideoSchema.safeParse({ public_id });
  if (!success) {
    throw Error(error.issues[0].message);
  }
  return data;
}

export {
  sendOtpSchema,
  credentialsSchema,
  emailValidation,
  registerUserValidation,
  deleteVideoValidatation,
};
export type CredentialsType = z.infer<typeof credentialsSchema>;
