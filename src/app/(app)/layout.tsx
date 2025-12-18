import React from "react";
import { Navbar } from "@/components/dashboard/Navbar";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { getUser } from "../../lib/data/user/getUser";
import { DataBoundary } from "@/components/core/DataBoundary";
import { getCredits } from "@/lib/data/user/getCredits";

export default async function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = await getUser();
  const { credits } = await getCredits();

  return (
    <DataBoundary user={user} credits={credits!}>
      <div className="flex flex-col h-screen bg-white dark:bg-background text-black dark:text-white transition-colors">
        <Navbar />
        <div className="flex flex-1 overflow-hidden">
          {/* Desktop sidebar */}
          <aside className="hidden lg:flex flex-col w-64 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-muted">
            <Sidebar />
          </aside>
          {/* Main content */}
          <main className="flex-1 overflow-auto w-full">
            <div className="p-0 sm:p-4 md:p-6 dark:bg-background w-full h-full">
              {children}
            </div>
          </main>
        </div>
      </div>
    </DataBoundary>
  );
}
