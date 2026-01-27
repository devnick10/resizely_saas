'use client';

import { Button } from "@/components/ui/button";


export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {

  return (
    <div className="bg-background text-primary-foreground flex justify-center items-center h-screen w-full flex-col gap-4">
      <h2>{error.message ?? "Something went wrong!"}</h2>
      <Button onClick={() => reset()}>
        Home
      </Button>
    </div>
  );
}
