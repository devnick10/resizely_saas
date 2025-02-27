"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useClerk, useUser } from "@clerk/nextjs";
import Image from "next/image";
import Script from "next/script";
import {
  LogOutIcon,
  MenuIcon,
  LayoutDashboardIcon,
  Share2Icon,
  UploadIcon,
  ImageIcon,
  LogInIcon,
  CoinsIcon,
  
} from "lucide-react";
import axios from "axios";
import { useCreditContext } from "@/context";
import toast from "react-hot-toast";

const sidebarItems = [
  { href: "/home", icon: LayoutDashboardIcon, label: "Home Page" },
  { href: "/social-share", icon: Share2Icon, label: "Resize Image" },
  { href: "/video-upload", icon: UploadIcon, label: "Compress Video" },
  { href: "/bg-remover", icon: ImageIcon, label: "Background Remover" },
];

export default function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useClerk();
  const { user } = useUser();
  const { credits, setCredits } = useCreditContext();

  // ✅ Fetch user credits
  useEffect(() => {
    if (!user) return;

    const fetchCredits = async () => {
      try {
        const response = await axios.get("/api/credits");
        if (response.status === 200) {
          setCredits(Number(response.data.credits));
        }
      } catch (error: any) {
        toast.error(error.response?.data?.error || "Failed to fetch credits");
      }
    };

    fetchCredits();
  }, [user, setCredits]);

  // ✅ Create user in DB if not exists
  useEffect(() => {
    if (!user) return;

    const createUser = async () => {
      try {
        await axios.post(
          "/api/users",
          { username: user?.username, email: user?.emailAddresses[0].emailAddress },
          { headers: { "Content-Type": "application/json" } }
        );
      } catch (error: any) {
        toast.error(error.response?.data?.error || "Failed to create user");
      }
    };

    createUser();
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    router.push("/home");
  };

  return (
    <div className="drawer lg:drawer-open">
      <input
        id="sidebar-drawer"
        type="checkbox"
        className="drawer-toggle"
        checked={sidebarOpen}
        onChange={() => setSidebarOpen(!sidebarOpen)}
      />
      <div className="drawer-content flex flex-col">
        {/* Navbar */}
        <header className="w-full bg-base-200">

          <div className="navbar max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex-none lg:hidden">
              <label htmlFor="sidebar-drawer" className="btn btn-square btn-ghost drawer-button">
                <MenuIcon />
              </label>
            </div>
            <div className="flex-1">
              <Link href="/" className="btn text-primary btn-ghost normal-case text-2xl font-bold tracking-tight">
                Resizely
              </Link>
            </div>
          {!user && <div className="flex space-x-2">
          <Link href="/" className="text-white border-b-2 border-blue-500 px-4 py-2  hover:text-primary">
             Home
          </Link>
          <Link href="/home" className="text-white border-b-2 border-blue-500 px-4 py-2  hover:text-primary">
             Get Started
          </Link>
        </div>}
            <div className="flex-none flex items-center space-x-4">
              {user ? (
                <>
                  {/* Display User Credits */}
                  <div className="flex gap-2 border-2 p-2 rounded-lg">
                    <CoinsIcon className="text-warning" />
                    <h1 className="text-warning">Credits</h1>
                    {credits || 0}
                  </div>
                  {/* User Avatar */}
                  <div className="avatar">
                    <div className="w-8 h-8 rounded-full">
                      <Image
                        src={user.imageUrl}
                        width={23}
                        height={23}
                        alt={user.username || user.emailAddresses[0].emailAddress}
                      />
                    </div>
                  </div>
                  {/* Username / Email */}
                  <span className="text-sm truncate max-w-xs lg:max-w-md">
                    {user.username || user.emailAddresses[0].emailAddress}
                  </span>
                  {/* Logout Button */}
                  <button onClick={handleSignOut} className="btn btn-ghost btn-circle">
                    <LogOutIcon className="h-6 w-6" />
                  </button>
                </>
              ) : (
                <>
                  Sign Up
                  <button onClick={() => router.push("/sign-up")} className="btn btn-ghost btn-circle">
                    <LogInIcon className="h-6 w-6" />
                  </button>
                </>
              )}
            </div>
          </div>
          
        </header>
        

        {/* Page Content */}
        <main className="flex-grow">
          <Script id="razorpay-checkout-js" src="https://checkout.razorpay.com/v1/checkout.js" />
          <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 my-8">{children}</div>
        </main>
      </div>

      {/* Sidebar */}
      <div className="drawer-side">
        <label htmlFor="sidebar-drawer" className="drawer-overlay"></label>
        <aside className="bg-base-200 w-64 h-full flex flex-col">
          <div className="flex items-center justify-between py-4 px-4">
            <ImageIcon className="w-10 h-10 text-primary" /> 
          </div>
          <ul className="menu p-4 w-full text-base-content flex-grow">
            {sidebarItems.map((item) => (
              <li key={item.href} className="mb-2">
                <Link
                  href={item.href}
                  className={`flex items-center space-x-4 px-4 py-2 rounded-lg ${
                    pathname === item.href ? "bg-primary text-white" : "hover:bg-base-300"
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="w-6 h-6" />
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
          {user && (
            <div className="p-4 flex flex-col gap-2">
              <button onClick={() => router.push("/payment")} className="btn btn-outline btn-warning w-full">
                <CoinsIcon className="mr-2 h-5 w-5" />
                Buy Credits
              </button>
              <button onClick={handleSignOut} className="btn btn-outline btn-error w-full">
                <LogOutIcon className="mr-2 h-5 w-5" />
                Sign Out
              </button>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
