import { cn } from "@/lib/cn";
import { LoaderIcon } from "lucide-react";
import React from "react";

interface LoaderProps {
  label?: string;
}

export const Loader: React.FC<LoaderProps> = ({ label }) => {
  return (
    <div className="flex w-full max-w-xs items-center justify-center gap-2 text-xl">
      <Spinner />
      <span className="text-[16px]">{label ? label : "Loading"}</span>
    </div>
  );
};

function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <LoaderIcon
      role="status"
      aria-label="Loading"
      className={cn("size-4 animate-spin", className)}
      {...props}
    />
  );
}
