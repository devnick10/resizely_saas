import { TransformationType } from "@prisma/client";

export enum Plan {
  Pro = 49900, //INR 499RS
  Standard = 19900, //INR 199RS
}

export interface User {
  id?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

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

export type Transformations = {
  id: string;
  tranformedPublicId: string;
  type: TransformationType;
  transformation?: Transformation;
  createdAt: string;
};

export type Transformation = {
  resize?: {
    width?: number;
    height?: number;
    crop?: "fill" | "fit" | "scale" | "thumb";
    aspectRatio?: string;
  };
  format?: "jpg" | "png" | "webp" | "avif";
  quality?: number | "auto";
  [key: string]: unknown;
};

export interface Image {
  id: string;
  publicId: string;
  createdAt: string;
  transformations: Transformations[];
}

export interface RegisterUserInput {
  email: string;
  password: string;
  username: string;
}

export interface VideoUploadPayload {
  title: string;
  description: string;
  file: File | null;
}

export interface VerifyPaymentHandler {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}
