import React, { Suspense } from "react";
import { Videos } from "../Videos";
import { Loader } from "lucide-react";
import { getUser } from "@/lib/data/user/getUser";
import { getCredits } from "@/lib/data/user/getCredits";
import { StoreInitializer } from "@/components/core/StoreInitializer";

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
  const [user, credits] = await Promise.all([getUser(), getCredits()]);
  return (
    <>
      <StoreInitializer user={user} credits={credits} />
      <Videos />
    </>
  );
};
