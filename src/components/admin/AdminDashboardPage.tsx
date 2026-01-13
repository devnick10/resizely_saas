import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { redirect } from "next/navigation";
import { getAdminStats } from "@/lib/data/admin/getAdminStats";
import { getDailyUploads } from "@/lib/data/admin/getDailyUploads";
import { getCreditsOverview } from "@/lib/data/admin/getCreditsOverview";
import { getAdmin } from "@/lib/data/admin/getAdmin";

export const AdminDashboardPage = async () => {
  const user = await getAdmin();

  if (!user || user.role !== "ADMIN") {
    redirect("/");
  }
  const [stats, usage, credits] = await Promise.all([
    getAdminStats(),
    getDailyUploads(7),
    getCreditsOverview(),
  ]);

  return (
    <AdminDashboard
      stats={{
        users: stats.totalUsers,
        images: stats.totalImages,
        videos: stats.totalVideos,
        creditsUsed: credits.totalCredits,
      }}
      usageData={usage}
    />
  );
};
