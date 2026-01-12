import { RegisterUserInput } from "@/types";
import {
  credentialsSchema,
  DeleteImagePayload,
  deleteImageSchema,
  deleteVideoSchema,
  orderSchema,
  sendOtpSchema,
  VerifyPaymentSchema,
} from "./schema";

export function emailValidation(email: string) {
  const { success, data, error } = sendOtpSchema.safeParse(email);
  if (!success) {
    throw Error(error.issues[0].message);
  }
  return data.email;
}

export function verifyPaymentRequestValidation(
  requestData: VerifyPaymentSchema,
) {
  const { success, data, error } = VerifyPaymentSchema.safeParse(requestData);
  if (!success) {
    throw Error(error.issues[0].message);
  }
  return data;
}

export function orderValidation(amount: string) {
  const { success, data, error } = orderSchema.safeParse(amount);
  if (!success) {
    throw Error(error.issues[0].message);
  }
  return data.amount;
}

export function registerUserValidation(user: RegisterUserInput) {
  const { success, data, error } = credentialsSchema.safeParse(user);
  if (!success) {
    throw Error(error.issues[0].message);
  }
  return data;
}

export function deleteVideoValidatation(public_id: string) {
  const { success, data, error } = deleteVideoSchema.safeParse({ public_id });
  if (!success) {
    throw Error(error.issues[0].message);
  }
  return data;
}

export function deleteImageValidatation(payload: DeleteImagePayload) {
  const { success, data, error } = deleteImageSchema.safeParse(payload);
  if (!success) {
    throw Error(error.issues[0].message);
  }
  return data;
}
