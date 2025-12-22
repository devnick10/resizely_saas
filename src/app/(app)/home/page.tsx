import { Loader } from "@/components/core/Loader";
import { Videos } from "@/components/dashboard/Videos";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<Loader />}>
      <Videos />
    </Suspense>
  );
}
