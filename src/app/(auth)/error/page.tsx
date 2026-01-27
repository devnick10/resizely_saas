export const dynamic = 'force-dynamic'
import { Loader } from "@/components/core/Loader";
import { AuthError } from "@/components/pages/AuthError";
import { Suspense } from "react";

export default function page() {
    return (<>
        <Suspense fallback={<Loader />}>
            <AuthError />
        </Suspense>
    </>)
}
