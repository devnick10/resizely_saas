import React, { Suspense } from "react";
import { Videos } from "../Videos";
import { Loader } from "@/components/core/Loader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Images } from "../Images";
export const Dashboard: React.FC = async () => {
  return (
    <div className="mt-5 w-full p-4">
      <Tabs defaultValue="images" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="images">Images</TabsTrigger>
          <TabsTrigger value="videos">Videos</TabsTrigger>
        </TabsList>
        <TabsContent value="images" className="mt-4">
          <Suspense
            fallback={
              <div className="flex w-full justify-center">
                <Loader label="Fetching Videos" />
              </div>
            }
          >
            <Images />
          </Suspense>
        </TabsContent>
        <TabsContent value="videos" className="mt-4">
          <Suspense
            fallback={
              <div className="flex w-full justify-center">
                <Loader label="Fetching Videos" />
              </div>
            }
          >
            <Videos />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
};
