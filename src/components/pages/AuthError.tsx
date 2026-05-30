"use client";

import { Button } from "@/components/ui/button";
import { getSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

import React, { useEffect } from "react";

export const AuthError = () => {
  const search = useSearchParams();
  const error = search.get("error");
  const router = useRouter();
  useEffect(() => {
    if (!error) {
      router.back();
    }
  }, [error, router]);
  getSession().then((session) => {
    if (session?.user) {
      router.back();
    }
  });
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-background text-primary-foreground">
      <h2>{error ?? "Something went wrong!"}</h2>
      <Button onClick={() => router.replace("/")}>Home</Button>
    </div>
  );
};
