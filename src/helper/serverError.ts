export function throwServerError(
  error: unknown,
  fallbackMessage: string,
): never {
  console.error(fallbackMessage, error);
  if (error instanceof Error) {
    throw error;
  }
  throw new Error(fallbackMessage);
}
