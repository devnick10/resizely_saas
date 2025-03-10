"use client"
import { createContext, useContext, useState, ReactNode } from "react";

interface IContext {
  credits: number | undefined;
  setCredits: React.Dispatch<React.SetStateAction<number | undefined>>;
}

const Context = createContext<IContext | undefined>(undefined);

export function ContextProvider({ children }: { children: ReactNode }) {
  const [credits, setCredits] = useState<number | undefined>(0);

  return (
    <Context.Provider value={{ credits, setCredits }}>
      {children}
    </Context.Provider>
  );
}


export function useCreditContext() {
  const context = useContext(Context);
  if (!context) {
    throw new Error("useCreditContext must be used within a ContextProvider");
  }
  return context;
}