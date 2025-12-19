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
      <nav className="shrink-0 overflow-hidden px-2 sm:px-6 py-2 border-b border-gray-200 dark:border-gray-500 flex md:flex-nowrap justify-between items-center bg-white dark:bg-muted w-full">
        {/* Navbar left section */}
        <div className="flex m-0 justify-center items-center">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden m-2 dark:text-gray-200 dark:hover:bg-muted"
              >
                <MenuIcon className="h-10 w-10" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-64 p-0 dark:bg-muted dark:border-gray-800"
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
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 ml-auto">
            <div className="hidden sm:flex items-center gap-4">
              <div className="flex border border-black dark:border-gray-700 rounded-md p-2 items-center gap-2 text-yellow-500">
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
                <div className="bg-gray-200 dark:bg-gray-600 flex items-center justify-center p-2.5 sm:p-4 font-bold border border-gray-300 dark:border-gray-600 rounded-full w-4 h-4">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
              )}
              <span className="font-medium text-sm truncate max-w-[100px] sm:max-w-[150px] dark:text-gray-200">
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
