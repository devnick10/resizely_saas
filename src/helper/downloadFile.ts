"use client";

type DownloadFileOptions = {
  url: string;
  filename?: string;
};

export async function downloadFile({
  url,
  filename = "download",
}: DownloadFileOptions): Promise<void> {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Failed to fetch file");
    }

    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = objectUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(objectUrl);
  } catch (error) {
    throw error;
  }
}
