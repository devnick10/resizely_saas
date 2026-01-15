import { User } from "@/types";
import { createStore } from "zustand/vanilla";

export interface UserState {
  user: User | null;
}

export interface UserActions {
  setUser: (user: User | null) => void;
}

export type UserStore = UserState & UserActions;

export const defaultInitState: UserState = {
  user: null,
};

export const createUserStore = (initState: UserState = defaultInitState) => {
  return createStore<UserStore>()((set) => ({
    ...initState,
    setUser: (user) => set(() => ({ user })),
  }));
};
