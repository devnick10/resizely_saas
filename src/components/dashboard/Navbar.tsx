"use client";
import { ModeToggle } from "@/components/core/ModeToggle";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { CoinsIcon, LogOutIcon, MenuIcon } from "lucide-react";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useCreditsStore, useNavbarStore, useUserStore } from "@/stores/hooks";

export const Navbar: React.FC = () => {
  const { isOpen, setIsOpen } = useNavbarStore((state) => state);
  const { credits } = useCreditsStore((state) => state);
  const { user } = useUserStore((state) => state);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <>
      <nav className="flex w-full shrink-0 items-center justify-between overflow-hidden border-b border-gray-200 bg-white px-2 py-2 dark:border-gray-500 dark:bg-muted sm:px-6 md:flex-nowrap">
        {/* Navbar left section */}
        <div className="m-0 flex items-center justify-center">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="m-2 dark:text-gray-200 dark:hover:bg-muted lg:hidden"
              >
                <MenuIcon className="h-10 w-10" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-64 p-0 dark:border-gray-800 dark:bg-muted"
            >
              <VisuallyHidden>
                <SheetTitle>Sidebar Menu</SheetTitle>
              </VisuallyHidden>
              <Sidebar />
            </SheetContent>
          </Sheet>
          <div>
            <Link href="/" className="text-xl font-bold text-primary">
              Resizely
            </Link>
          </div>
        </div>
        {/* Navbar right section */}
        <div className="flex">
          <div className="ml-auto flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
            <div className="hidden items-center gap-4 sm:flex">
              <div className="flex items-center gap-2 rounded-md border border-black p-2 text-yellow-500 dark:border-gray-700">
                <CoinsIcon className="h-5 w-5" />
                <span>{credits ?? 0} Credits</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {user?.image ? (
                <Image
                  src={user.image}
                  alt={user.name || "Avatar"}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              ) : (
                <div className="flex h-4 w-4 items-center justify-center rounded-full border border-gray-300 bg-gray-200 p-2.5 font-bold dark:border-gray-600 dark:bg-gray-600 sm:p-4">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
              )}
              <span className="max-w-[100px] truncate text-sm font-medium dark:text-gray-200 sm:max-w-[150px]">
                {user?.name || user?.email?.split("@")[0]}
              </span>
              <div className="hidden sm:block">
                <Button
                  onClick={handleSignOut}
                  variant="outline"
                  size="icon"
                  className="shrink-0 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
                >
                  <LogOutIcon className="h-5 w-5" />
                </Button>
              </div>
              <ModeToggle />
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};
