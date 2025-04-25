"use client";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Script from "next/script";
import {
  LogOutIcon,
  MenuIcon,
  LayoutDashboardIcon,
  Share2Icon,
  UploadIcon,
  ImageIcon,
  CoinsIcon,
} from "lucide-react";
import { useCreditContext } from "@/context";
import toast from "react-hot-toast";
import { getCredits } from "@/actions/getCredits";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ModeToggle } from "@/components/ModeToggle";

const sidebarItems = [
  { href: "/home", icon: LayoutDashboardIcon, label: "Home Page" },
  { href: "/social-share", icon: Share2Icon, label: "Resize Image" },
  { href: "/video-upload", icon: UploadIcon, label: "Compress Video" },
  { href: "/bg-remover", icon: ImageIcon, label: "Background Remover" },
];

export default function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<unknown>();
  const pathname = usePathname();
  const { data } = useSession();
  const { credits, setCredits } = useCreditContext();

  useEffect(() => {
    if (!data?.user) return;

    const fetchCredits = async () => {
      try {
        const response = await getCredits(data.user.email!);
        if (response && response.success) {
          setCredits(Number(response.credits));
        }
      } catch (error) {
        setError(error);
        toast.error("Failed to fetch credits");
      }
    };

    fetchCredits();
  }, [data, setCredits]);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  if (error) toast.error("Sorry for inconvenience");
  if (!data || !data.user) return null;


  return (
    <div className="flex flex-col h-screen bg-white dark:bg-background text-black dark:text-white transition-colors">
      <header className="shrink-0 overflow-hidden px-2 sm:px-6 py-2 border-b border-gray-200 dark:border-gray-500 flex md:flex-nowrap justify-between items-center bg-white dark:bg-muted w-full">
        {/* Navbar left section */}
        <div className="flex m-0 justify-center items-center">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden m-2 dark:text-gray-200 dark:hover:bg-muted">
                <MenuIcon className="h-10 w-10" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0 dark:bg-muted dark:border-gray-800">
              <VisuallyHidden>
                <SheetTitle>Sidebar Menu</SheetTitle>
              </VisuallyHidden>
              <Sidebar pathname={pathname} setOpen={setOpen} credits={credits} />
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
            <div className="hidden sm:block flex items-center gap-4">
              <div className="flex border border-black dark:border-gray-700 rounded-md p-2 items-center gap-2 text-yellow-500">
                <CoinsIcon className="h-5 w-5" />
                <span>{credits ?? 0} Credits</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {data.user.image ? (
                <Image
                  src={data.user.image}
                  alt={data.user.name || "Avatar"}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              ) : (
                <div className="bg-gray-200 dark:bg-gray-600 flex items-center justify-center p-2.5 sm:p-4 font-bold border border-gray-300 dark:border-gray-600 rounded-full w-4 h-4">
                  {data.user.name?.charAt(0).toUpperCase()}
                </div>
              )}
              <span className="font-medium text-sm truncate max-w-[100px] sm:max-w-[150px] dark:text-gray-200">
                {data.user.name || data.user.email?.split("@")[0]}
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
      </header>
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop sidebar */}
        <aside className="hidden lg:flex flex-col w-64 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-muted">
          <Sidebar pathname={pathname} setOpen={setOpen} credits={credits} />
        </aside>
        {/* Main content */}
        <main className="flex-1 overflow-auto w-full">
          <Script id="razorpay-checkout-js" src="https://checkout.razorpay.com/v1/checkout.js" />
          <div className="p-0 sm:p-4 md:p-6 dark:bg-background w-full h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

function Sidebar({ pathname, setOpen, credits }: { pathname: string, setOpen: Dispatch<SetStateAction<boolean>>, credits?: number }) {
  const router = useRouter();
  return (
    <div className="overflow-hidden flex pt-8 sm:pt-2 flex-col h-full justify-between">
      <nav className="flex flex-col gap-2 p-4">
        {sidebarItems.map((item) => (
          <Button
            key={item.href}
            variant={pathname === item.href ? "default" : "ghost"}
            className="justify-start w-full gap-2"
            onClick={() => {
              router.push(item.href);
              setOpen(false);
            }}
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </Button>
        ))}
      </nav>
      <div className="p-4">
        <Separator className="mb-4" />
        <div className="sm:hidden block w-full flex items-center gap-4">
          <div className="flex border w-full justify-center border-black dark:border-gray-700 rounded-md p-2 items-center gap-2 text-yellow-500">
            <CoinsIcon className="h-5 w-5" />
            <span>{credits ?? 0} Credits</span>
          </div>
        </div>
        <Separator className="mb-4" />
        <Button
          onClick={() => router.push("/payment")}
          className="w-full mb-2 border dark:border-gray-700"
          variant="secondary"
        >
          <CoinsIcon className="w-4 h-4 mr-2 text-yellow-500" /> Buy Credits
        </Button>
        <Button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="w-full"
          variant="destructive"
        >
          <LogOutIcon className="w-4 h-4 mr-2" /> Sign Out
        </Button>
      </div>
    </div>
  );
}
