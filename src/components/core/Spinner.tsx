import { cn } from "@/lib/cn";
import { LoaderIcon } from "lucide-react";

export const Spinner: React.FC<React.ComponentProps<"svg">> = ({
  className,
  ...props
}) => {
  return (
    <LoaderIcon
      role="status"
      aria-label="Loading"
      className={cn("size-4 animate-spin", className)}
      {...props}
    />
  );
};
