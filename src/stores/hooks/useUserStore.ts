"use client";

import { useStore } from "zustand";
import { UserStore } from "../userStore";
import { useContext } from "react";
import { RootStoreContext } from "@/components/core/StoreProvider";

export function useUserStore<T>(selector: (s: UserStore) => T) {
  const ctx = useContext(RootStoreContext);
  if (!ctx) throw new Error("Missing RootStoreProvider");
  return useStore(ctx.userStore, selector);
}
