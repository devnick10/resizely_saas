"use client";
import { useCreditsStore, useUserStore } from "@/stores/hooks";
import { User } from "@/types";
import { useEffect, useRef } from "react";

interface StoreInitializerProps {
  user: User | null;
  credits: number;
}

export const StoreInitializer: React.FC<StoreInitializerProps> = (props) => {
  const initialized = useRef<boolean>(false);
  const { setUser } = useUserStore((s) => s);
  const { setCredits } = useCreditsStore((s) => s);
  useEffect(() => {
    if (!initialized.current) {
      setUser(props.user);
      setCredits(props.credits);
      initialized.current = true;
    }
  }, [props, setUser, setCredits, initialized]);
  return null;
};
