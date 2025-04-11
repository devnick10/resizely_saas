"use client";
import React, { useEffect, useState } from "react";
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
  const [error, setError] = useState<unknown>();
  const pathname = usePathname();
  const router = useRouter();
  const { data } = useSession()
  const { credits, setCredits } = useCreditContext();


  // ✅ Fetch user credits
  useEffect(() => {
    if (!data?.user) return;

    const fetchCredits = async () => {
      try {
        const response = await getCredits(data.user.email!)

        if (response && response.success) {
          setCredits(Number(response.credits));
        }
      } catch (error) {
        setError(error)
        toast.error("Failed to fetch credits");
      }
    };

    fetchCredits();
  }, [data, setCredits]);

  const handleSignOut = async () => {
    await signOut({
      callbackUrl:"/"
    });
  };

  if (error) {
    toast.error("Sorry for inconvenience")
  }

  if (!data || !data.user) return null
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

          <div className="navbar max-w-7xl mx-auto px-2">
            <div className="flex-none lg:hidden">
              <label htmlFor="sidebar-drawer" className="btn btn-square btn-ghost drawer-button">
                <MenuIcon />
              </label>
            </div>
            <div className="flex-1">
              <Link href="/" className="text-[1rem] btn text-blue-400 btn-ghost normal-case sm:text-xl font-bold tracking-tight">
                Resizely
              </Link>
            </div>
            {!data.user && <div className="flex space-x-2">
              <Link href="/" className="text-white border-b-2 border-blue-500 px-4 py-2  hover:text-primary">
                Home
              </Link>
              <Link href="/home" className="text-white border-b-2 border-blue-500 px-4 py-2  hover:text-primary">
                Get Started
              </Link>
            </div>}
            <div className="flex-none flex items-center space-x-2">
              {data.user ? (
                <>
                  {/* Display User Credits */}
                  <div className="sm:block hidden">

                    <div className=" flex gap-2 border-2 p-2 rounded-lg">
                      <CoinsIcon className="text-warning" />
                      <h1 className="text-warning">Credits</h1>
                      {credits || 0}
                    </div>
                  </div>
                  {/* User Avatar */}
                  <div className="avatar">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full">
                      {
                        data.user.image && <Image
                          src={data.user.image}
                          width={23}
                          height={23}
                          alt={data.user.name || ""}
                        />
                      }
                      <h1>{data.user.name?.slice(0, 1)}</h1>
                    </div>
                  </div>
                  {/* Username / Email */}
                  <span className="text-sm sm:text-[1rem] truncate max-w-xs lg:max-w-md">
                    @{data.user.name}
                  </span>
                  {/* Logout Button */}
                  <button onClick={handleSignOut} className=" sm:block hidden btn btn-ghost btn-circle">
                    <LogOutIcon className="h-6 w-6" />
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => router.push("/sign-up")} className="px-4 py-2 bg-blue-500 rounded-lg ml-2">
                    Signup
                  </button>
                </>
              )}
            </div>
          </div>

        </header>


        {/* Page Content */}
        <main className="flex-grow">
          <Script id="razorpay-checkout-js" src="https://checkout.razorpay.com/v1/checkout.js" />
          <div className="max-w-7xl mx-auto w-full min-h-dvh px-4 sm:px-6 lg:px-8 my-8" >   {children}

          </div>
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
                  className={`flex items-center space-x-4 px-4 py-2 rounded-lg ${pathname === item.href ? "bg-primary text-white" : "hover:bg-base-300"
                    }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="w-6 h-6" />
                  <span>{item.label}</span>
                </Link>
              </li>

            ))}
            <div className="block sm:hidden">
              <div className=" flex items-center space-x-6 px-4 py-2 rounded-lg">
                <CoinsIcon className="text-warning w-6 h-6" />
                <div className="flex gap-2 font-semibold">
                  <span className="text-warning ">Credits</span>
                  <span className="rounded-full border-yellow-500 text-center border-2 w-6 h-6">
                    {credits || 0}
                  </span>
                </div>
              </div>
            </div>
          </ul>
          {data.user && (
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
