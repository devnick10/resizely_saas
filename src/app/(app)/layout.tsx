import { StoreInitializer } from "@/components/core/StoreInitializer";
import { getCredits } from "@/lib/data/user/getCredits";
import { getUser } from "@/lib/data/user/getUser";
import { redirect } from "next/navigation";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, credits] = await Promise.allSettled([getUser(), getCredits()]);

  if (user.status === "rejected") {
    redirect("/sign-in");
  }

  return (
    <>
      <StoreInitializer
        user={user.status === "fulfilled" ? user.value : null}
        credits={credits.status === "fulfilled" ? credits.value : 0}
      />
      {children}
    </>
  );
}
