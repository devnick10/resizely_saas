"use client";

import { createCreditsStore } from "@/stores/creditStore";
import { createNavbarStore } from "@/stores/navbarStore";
import { createUserStore } from "@/stores/userStore";
import { createContext, useState } from "react";

type RootStore = {
  // update when add a new store
  navbarStore: ReturnType<typeof createNavbarStore>;
  creditsStore: ReturnType<typeof createCreditsStore>;
  userStore: ReturnType<typeof createUserStore>;
};

export const RootStoreContext = createContext<RootStore | null>(null);

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
