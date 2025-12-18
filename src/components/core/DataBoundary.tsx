"use client";
import { useEffect } from "react";
import { useCreditsStore, useUserStore } from "./storeProvider";
import { User } from "@/types";

interface DataBoundaryProps {
  children: React.ReactNode;
  user: User | null;
  credits: number;
}

export function DataBoundary({ children, user, credits }: DataBoundaryProps) {
  const { setUser } = useUserStore((s) => s);
  const { setCredits } = useCreditsStore((s) => s);
  useEffect(() => {
    setUser(user);
    setCredits(credits);
  }, [user, setUser, credits, setCredits]);

  return <>{children}</>;
}
