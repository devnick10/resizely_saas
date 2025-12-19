import { Videos } from "@/components/dashboard/Videos";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VIdeoUploadForm } from "../dashboard/videoUploadForm";
import { Suspense } from "react";
import { Loader } from "../core/Loader";

export const VideoUpload: React.FC = () => {
  return (
    <div className="overflow-hidden w-full mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-center">
        Upload Video
      </h1>
      <p className="text-center font-semibold mb-6">
        Video Compression Service – Currently for Videos up to 70MB (More Coming
        Soon!) 🚀
      </p>
      <Card className="px-2">
        <CardHeader>
          <CardTitle>Upload a Video</CardTitle>
        </CardHeader>
        <CardContent>
          <VIdeoUploadForm />
        </CardContent>
      </Card>
      <div className="mt-8">
        <Suspense fallback={<Loader />}>
          <Videos />
        </Suspense>
      </div>
    </div>
  );
};
