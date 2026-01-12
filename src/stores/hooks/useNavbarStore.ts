"use client";

import { useContext } from "react";
import { NavbarStore } from "../navbarStore";
import { RootStoreContext } from "@/components/core/StoreProvider";
import { useStore } from "zustand";

export function useNavbarStore<T>(selector: (s: NavbarStore) => T) {
  const ctx = useContext(RootStoreContext);
  if (!ctx) throw new Error("Missing RootStoreProvider");

  return useStore(ctx.navbarStore, selector);
}
