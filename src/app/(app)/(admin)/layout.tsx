import { Navbar } from "@/components/dashboard/Navbar";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { getUser } from "@/lib/data/user/getUser";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  if (!user || user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  if (user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* NAVBAR */}
      <header className="h-16 shrink-0">
        <Navbar />
      </header>

      {/* CONTENT */}
      <div className="flex min-h-0 flex-1">
        {/* SIDEBAR */}
        <aside className="hidden w-64 shrink-0 border-r bg-background lg:block">
          <AdminSidebar />
        </aside>

        {/* MAIN */}
        <main className="flex-1 overflow-y-auto p-4">{children}</main>
      </div>
    </div>
  );
}
