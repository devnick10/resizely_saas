"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toggleUserBlock } from "@/actions/admin/updateUserStatus";
import { changeUserRole } from "@/actions/admin/updateUserRole";
import { ROLE } from "@prisma/client";
import { useTransition } from "react";
import toast from "react-hot-toast";

interface Props {
  userId: string;
  isBlocked: boolean;
  role: ROLE;
}

export const AdminUserActions: React.FC<Props> = ({
  userId,
  isBlocked,
  role,
}) => {
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex flex-wrap gap-3">
      {/* Block / Unblock */}
      <Button
        variant={isBlocked ? "secondary" : "destructive"}
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            try {
              await toggleUserBlock(userId);
              toast.success(isBlocked ? "User unblocked" : "User blocked");
            } catch (e: any) {
              toast.error(e.message);
            }
          })
        }
      >
        {isBlocked ? "Unblock User" : "Block User"}
      </Button>

      {/* Role Toggle */}
      <Button
        variant="outline"
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            try {
              await changeUserRole(
                userId,
                role === "ADMIN" ? ROLE.USER : ROLE.ADMIN,
              );
              toast.success("Role updated");
            } catch (e: any) {
              toast.error(e.message);
            }
          })
        }
      >
        Make {role === "ADMIN" ? "User" : "Admin"}
      </Button>

      <Badge variant="secondary">{role}</Badge>
    </div>
  );
};
