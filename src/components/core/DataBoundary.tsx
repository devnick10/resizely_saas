"use client";
import { User } from "@/types";
import type { PropsWithChildren } from "react";
import { useEffect } from "react";
import { useCreditsStore, useUserStore } from "@/stores/hooks";

interface DataBoundaryProps extends PropsWithChildren {
  user: User | null;
  credits: number;
}

export const DataBoundary: React.FC<DataBoundaryProps> = (props) => {
  const { setUser } = useUserStore((s) => s);
  const { setCredits } = useCreditsStore((s) => s);
  useEffect(() => {
    setUser(props.user);
    setCredits(props.credits);
  }, [props, setUser, setCredits]);

  return props.children;
};
