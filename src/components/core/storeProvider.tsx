"use client";

import { createContext, useContext, useState } from "react";

import { createNavbarStore, NavbarStore } from "@/stores/navbarStore";

import { useStore } from "zustand";
import { createCreditsStore, CreditsStore } from "@/stores/creditStore";
import { createUserStore, UserStore } from "@/stores/userStore";

type RootStore = {
  // update when add a new store
  navbarStore: ReturnType<typeof createNavbarStore>;
  creditsStore: ReturnType<typeof createCreditsStore>;
  userStore: ReturnType<typeof createUserStore>;
};

const RootStoreContext = createContext<RootStore | null>(null);

export function RootStoreProvider({ children }: { children: React.ReactNode }) {
  const [stores] = useState<RootStore>(() => ({
    // when you create a new store add here
    navbarStore: createNavbarStore(),
    creditsStore: createCreditsStore(),
    userStore: createUserStore(),
  }));

  return (
    <RootStoreContext.Provider value={stores}>
      {children}
    </RootStoreContext.Provider>
  );
}

export function useNavbarStore<T>(selector: (s: NavbarStore) => T) {
  const ctx = useContext(RootStoreContext);
  if (!ctx) throw new Error("Missing RootStoreProvider");

  return useStore(ctx.navbarStore, selector);
}

export function useCreditsStore<T>(selector: (s: CreditsStore) => T) {
  const ctx = useContext(RootStoreContext);
  if (!ctx) throw new Error("Missing RootStoreProvider");

  return useStore(ctx.creditsStore, selector);
}

export function useUserStore<T>(selector: (s: UserStore) => T) {
  const ctx = useContext(RootStoreContext);
  if (!ctx) throw new Error("Missing RootStoreProvider");

  return useStore(ctx.userStore, selector);
}
