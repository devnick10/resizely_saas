import { createStore } from "zustand/vanilla";

export type NavbarState = {
  isOpen: boolean;
};

export type NavbarActions = {
  setIsOpen: (val: boolean) => void;
};

export type NavbarStore = NavbarState & NavbarActions;

export const defaultInitState: NavbarState = {
  isOpen: false,
};

export const createNavbarStore = (
  initState: NavbarState = defaultInitState,
) => {
  return createStore<NavbarStore>()((set) => ({
    ...initState,
    setIsOpen: (val: boolean) => set(() => ({ isOpen: val })),
  }));
};
