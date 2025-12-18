import React from "react";

export function useLoader() {
  const [loading, setLoading] = React.useState<boolean>();

  return {
    setLoading,
    loading,
  };
}
