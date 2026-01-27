'use client';

import { Button } from "@/components/ui/button";
import { getSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

export default function page() {
    const search = useSearchParams()
    const error = search.get("error")
    const router = useRouter()
    getSession().then((session)=>{
        if(session?.user){
            router.back()
        }
    })
    return (
        <div className="bg-background text-primary-foreground flex justify-center items-center h-screen w-full flex-col gap-4">
            <h2>{error ?? "Something went wrong!"}</h2>
            <Button onClick={() => router.replace('/')}>
                Home
            </Button>
        </div>
    );
}
