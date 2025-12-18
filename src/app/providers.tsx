"use client";
import { ThemeProvider } from "@/components/core/ThemeProvider";
import { RootStoreProvider } from "@/components/core/storeProvider";
import { SessionProvider } from "next-auth/react";
import Script from "next/script";
import React from "react";
import { Toaster } from "react-hot-toast";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <RootStoreProvider>
        <Toaster />
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="beforeInteractive"
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </RootStoreProvider>
    </SessionProvider>
  );
}
