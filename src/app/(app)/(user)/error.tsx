"use client";
import { useEffect } from "react";
import toast from "react-hot-toast";

export default function Error({ error }: { error: Error }) {
  useEffect(() => {
    toast.error(error.message);
  }, [error]);

  return (
    <div className="flex h-full items-center justify-center">
      <p className="text-lg font-semibold">Something went wrong</p>
    </div>
  );
}
