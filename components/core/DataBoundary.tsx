"use client";
import { useEffect } from "react";
import { useUserStore } from "./storeProvider";
import { User } from "@/types";

export function DataBoundary({
  children,
  user,
}: {
  children: React.ReactNode;
  user: User | null;
}) {
  const { setUser } = useUserStore((s) => s);
  useEffect(() => {
    setUser(user);
  }, [user, setUser]);

  return <>{children}</>;
}
