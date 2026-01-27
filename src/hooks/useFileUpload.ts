"use client";

import { uploadFile } from "@/actions/uploadFile";
import { throwClientError } from "@/helper/clientError";
import { UploadFilePaylolad } from "@/types";
import { useState } from "react";
import { useLoading } from "./useLoading";

export function useFileUpload() {
    const { loading, setLoading } = useLoading();
    const [error, setError] = useState<unknown>(null);

    const handleFileUpload = async (data:UploadFilePaylolad) => {
        if (!data.file) throwClientError("File is required.");

        setLoading(true);

        try {
            return await uploadFile({...data});
        } catch (err) {
            setError(err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        handleFileUpload,
        isUploading: loading,
        error,
    };
}
