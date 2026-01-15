import { createStore } from "zustand/vanilla";

export type creditsState = {
  credits: number;
};

export type creditsActions = {
  setCredits: (val: number) => void;
};

export type CreditsStore = creditsState & creditsActions;

export const defaultInitState: creditsState = {
  credits: 0,
};

export const createCreditsStore = (
  initState: creditsState = defaultInitState,
) => {
  return createStore<CreditsStore>()((set) => ({
    ...initState,
    setCredits: (val: number) => set(() => ({ credits: val <= 0 ? 0 : val })),
  }));
};
