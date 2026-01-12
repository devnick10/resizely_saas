import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VIdeoUploadForm } from "../VideoUploadForm";

export const VideoCompress: React.FC = () => {
  return (
    <div className="mx-auto w-full max-w-4xl overflow-hidden p-4">
      <h1 className="mb-4 text-center text-2xl font-bold sm:text-3xl">
        Upload Video
      </h1>
      <p className="mb-6 text-center font-semibold">
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
    </div>
  );
};
