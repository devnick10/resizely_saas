"use client";

import { RootStoreContext } from "@/components/core/StoreProvider";
import { useContext } from "react";
import { CreditsStore } from "../creditStore";
import { useStore } from "zustand";

export function useCreditsStore<T>(selector: (s: CreditsStore) => T) {
  const ctx = useContext(RootStoreContext);
  if (!ctx) throw new Error("Missing RootStoreProvider");

  return useStore(ctx.creditsStore, selector);
}
