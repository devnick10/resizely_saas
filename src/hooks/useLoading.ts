import React from "react";

export function useLoading() {
  const [loading, setLoading] = React.useState<boolean>(false);

  return {
    setLoading,
    loading,
  };
}
