export enum Plan {
  Pro = 342700,
  Standard = 171300,
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
