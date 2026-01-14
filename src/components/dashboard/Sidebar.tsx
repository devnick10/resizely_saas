"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { USER_SIDEBAR_ITEMS } from "@/lib/sidebar.config";
import { useCreditsStore, useNavbarStore } from "@/stores/hooks";
import { CoinsIcon, LogOutIcon, ShieldCheck } from "lucide-react";
import { signOut } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import clsx from "clsx";

export const Sidebar: React.FC = () => {
  const { setIsOpen } = useNavbarStore((state) => state);
  const { credits } = useCreditsStore((state) => state);
  const router = useRouter();
  const pathname = usePathname();

  return (
    <aside className="flex h-full flex-col justify-between bg-muted/40">
      {/* Top */}
      <div>
        {/* Brand */}
        <div className="flex items-center gap-2 px-6 py-5">
          <ShieldCheck className="h-5 w-5 text-primary" />
          <span className="text-lg font-semibold">Dashboard</span>
        </div>

        <Separator />

        {/* Navigation */}
        <nav className="space-y-2 px-3 py-4">
          <p className="px-3 text-xs font-medium uppercase text-muted-foreground">
            Tools
          </p>

          {USER_SIDEBAR_ITEMS.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Button
                key={item.href}
                variant="ghost"
                className={clsx(
                  "w-full justify-start gap-3 px-3",
                  isActive && "bg-primary/10 text-primary hover:bg-primary/15",
                )}
                onClick={() => {
                  setIsOpen(false);
                  router.push(item.href);
                }}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Button>
            );
          })}
        </nav>
      </div>

      {/* Footer */}
      <div className="px-4 py-4">
        <Separator className="mb-4" />

        {/* Credits */}
        <div className="mb-4 rounded-md border bg-yellow-500 px-3 py-2 text-sm font-bold text-neutral-900 dark:bg-background dark:bg-yellow-500">
          <div className="flex items-center gap-2">
            <CoinsIcon className="h-4 w-4" />
            <span>{credits ?? 0} Credits</span>
          </div>
        </div>

        <Button
          onClick={() => router.push("/payment")}
          className="mb-2 w-full"
          variant="secondary"
        >
          Buy Credits
        </Button>

        <Button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="w-full"
          variant="destructive"
        >
          <LogOutIcon className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </aside>
  );
};
