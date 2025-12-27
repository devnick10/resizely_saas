import React, { Suspense } from "react";
import { Videos } from "../Videos";
import { Loader } from "@/components/core/Loader";

export const Home: React.FC = async () => {
  return (
    <div className="container mx-auto mt-5 p-4">
      <h1 className="mb-4 font-inter text-2xl font-bold">All Videos</h1>
      <Suspense
        fallback={
          <div className="flex w-full justify-center">
            <Loader label="Fetching Videos" />
          </div>
        }
      >
        <Videos />
      </Suspense>
    </div>
  );
};
