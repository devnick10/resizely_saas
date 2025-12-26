import toast from "react-hot-toast";

export function throwClientError(
  error: unknown,
  fallbackMessage: string = "Something went wrong",
) {
  const message = error instanceof Error ? error.message : fallbackMessage;
  toast.error(message);
}
