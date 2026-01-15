"use client";

import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { deleteMediaAction } from "@/actions/admin/deleteMedia";
import React, { useTransition } from "react";

export const DeleteMediaButton: React.FC<{
  id: string;
  type: "IMAGE" | "VIDEO";
}> = ({ id, type }) => {
  const [pending, startTransition] = useTransition();

  return (
    <Button
      size="sm"
      variant="destructive"
      disabled={pending}
      onClick={() => {
        if (!confirm("Delete this media permanently?")) return;

        startTransition(() => {
          deleteMediaAction(id, type);
        });
      }}
    >
      <Trash2 className="mr-1 h-4 w-4" />
      Delete
    </Button>
  );
};
