import React, { Suspense } from "react";
import { Videos } from "../Videos";
import { Loader } from "lucide-react";
import { getUser } from "@/lib/data/user/getUser";
import { getCredits } from "@/lib/data/user/getCredits";
import { StoreInitializer } from "@/components/core/StoreInitializer";
import { throwClientError } from "@/helper/clientError";

export const Home: React.FC = async () => {
  return (
    <div className="container mx-auto mt-5 p-4">
      <h1 className="mb-4 text-2xl font-bold">All Videos</h1>
      <Suspense fallback={<Loader />}>
        <HomeData />
      </Suspense>
    </div>
  );
};

const HomeData: React.FC = async () => {
  const [user, credits] = await Promise.allSettled([getUser(), getCredits()]);
  if (user.status === "rejected")
    throwClientError(null, "Failed to fetch user data");
  if (credits.status === "rejected")
    throwClientError(null, "Failed to fetch user credits");
  return (
    <>
      <StoreInitializer
        user={user.status === "fulfilled" ? user.value : null}
        credits={credits.status === "fulfilled" ? credits.value : 0}
      />
      <Videos />
    </>
  );
};
