"use server"
import { v2 } from "cloudinary";

v2.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})
interface CloudinaryUploadResult {
    public_id: string;
    [key: string]: unknown;
}

export async function imageUpload(request: FormData) {
    try {
        const formData = request;
        const file = formData.get("file") as File | null;

        if (!file) {
            return { success: false, error: "File not found." }
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const uploadResult = await new Promise<CloudinaryUploadResult>((resolve, reject) => {
            const uploadStream = v2.uploader.upload_stream(
                { folder: "cloudinary_saas" },
                (error, result) => {
                    if (error || !result) {
                        reject(error || new Error("Upload failed"));
                    } else {
                        resolve(result as CloudinaryUploadResult);
                    }
                }
            );

            uploadStream.end(buffer);
        });

        return { success: true, publicId: uploadResult.public_id }

    } catch (error) {
        console.error(error);
        return { error, success: false, message: "Error while uploading image try again later." }
    }
}
