import { StoreInitializer } from "@/components/core/StoreInitializer";
import { Navbar } from "@/components/dashboard/Navbar";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { getCredits } from "@/lib/data/user/getCredits";
import { getUser } from "@/lib/data/user/getUser";
import { redirect } from "next/navigation";
import React from "react";

export default async function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [user, credits] = await Promise.allSettled([getUser(), getCredits()]);

  if (user.status === "rejected") {
    redirect("/sign-in");
  }

  return (
    <>
      <StoreInitializer
        user={user.status === "fulfilled" ? user.value : null}
        credits={credits.status === "fulfilled" ? credits.value : 0}
      />
      <div className="flex h-screen flex-col bg-white text-black transition-colors dark:bg-background dark:text-white">
        <Navbar />
        <div className="flex flex-1 overflow-hidden">
          {/* Desktop sidebar */}
          <aside className="hidden w-64 flex-col border-r border-gray-200 bg-white dark:border-gray-800 dark:bg-muted lg:flex">
            <Sidebar />
          </aside>
          {/* Main content */}
          <main className="w-full flex-1 overflow-auto">
            <div className="h-full w-full p-0 dark:bg-background sm:p-4 md:p-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
