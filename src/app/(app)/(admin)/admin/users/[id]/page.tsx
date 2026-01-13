import { UserDetailsPage } from "@/components/admin/pages/UserDetails";
import React from "react";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function page({ params }: PageProps) {
  const { id } = await params;
  return <UserDetailsPage id={id} />;
}
