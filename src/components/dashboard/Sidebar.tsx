"use client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  CoinsIcon,
  ImageIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  Share2Icon,
  UploadIcon,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useCreditsStore, useNavbarStore } from "@/stores/hooks";

const sidebarItems = [
  { href: "/home", icon: LayoutDashboardIcon, label: "Home Page" },
  { href: "/social-share", icon: Share2Icon, label: "Resize Image" },
  { href: "/video-upload", icon: UploadIcon, label: "Compress Video" },
  { href: "/bg-remover", icon: ImageIcon, label: "Background Remover" },
];

export const Sidebar: React.FC = () => {
  const { setIsOpen } = useNavbarStore((state) => state);
  const { credits } = useCreditsStore((state) => state);

  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col justify-between overflow-hidden pt-8 font-poppins sm:pt-2">
      <nav className="flex flex-col gap-2 p-4">
        {sidebarItems.map((item) => (
          <Button
            key={item.href}
            variant={pathname === item.href ? "default" : "ghost"}
            className="w-full justify-start gap-2"
            onClick={() => {
              setIsOpen(false);
              router.push(item.href);
            }}
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </Button>
        ))}
      </nav>
      <div className="p-4">
        <Separator className="mb-4" />
        <div className="flex w-full items-center gap-4 sm:hidden">
          <div className="flex w-full items-center justify-center gap-2 rounded-md border border-black p-2 text-yellow-500 dark:border-gray-700">
            <CoinsIcon className="h-5 w-5" />
            <span>{credits ?? 0} Credits</span>
          </div>
        </div>
        <Separator className="mb-4" />
        <Button
          onClick={() => router.push("/payment")}
          className="mb-2 w-full border dark:border-gray-700"
          variant="secondary"
        >
          <CoinsIcon className="mr-2 h-4 w-4 text-yellow-500" /> Buy Credits
        </Button>
        <Button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="w-full"
          variant="destructive"
        >
          <LogOutIcon className="mr-2 h-4 w-4" /> Sign Out
        </Button>
      </div>
    </div>
  );
};
