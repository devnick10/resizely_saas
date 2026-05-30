"use client";

import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-background text-primary-foreground">
      <h2>{error.message ?? "Something went wrong!"}</h2>
      <Button onClick={() => reset()}>Home</Button>
    </div>
  );
}
