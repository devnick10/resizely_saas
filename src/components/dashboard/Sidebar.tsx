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
    <div className="overflow-hidden flex pt-8 sm:pt-2 flex-col h-full justify-between">
      <nav className="flex flex-col gap-2 p-4">
        {sidebarItems.map((item) => (
          <Button
            key={item.href}
            variant={pathname === item.href ? "default" : "ghost"}
            className="justify-start w-full gap-2"
            onClick={() => {
              setIsOpen(false);
              router.push(item.href);
            }}
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </Button>
        ))}
      </nav>
      <div className="p-4">
        <Separator className="mb-4" />
        <div className="sm:hidden w-full flex items-center gap-4">
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
};
