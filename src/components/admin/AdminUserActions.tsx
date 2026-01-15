"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toggleUserBlock } from "@/actions/admin/updateUserStatus";
import { changeUserRole } from "@/actions/admin/updateUserRole";
import { deleteUserAction } from "@/actions/admin/deleteUser";
import { ROLE } from "@prisma/client";
import { useTransition } from "react";
import toast from "react-hot-toast";
import { ShieldAlert, Trash2 } from "lucide-react";

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
    <div className="flex flex-wrap items-center gap-4">
      {/* LEFT: Status & Role */}
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant={role === "ADMIN" ? "destructive" : "secondary"}>
          {role}
        </Badge>

        <Button
          size="sm"
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
          {isBlocked ? "Unblock" : "Block"}
        </Button>

        <Button
          size="sm"
          variant="outline"
          disabled={pending}
          onClick={() =>
            startTransition(async () => {
              try {
                await changeUserRole(
                  userId,
                  role === ROLE.ADMIN ? ROLE.USER : ROLE.ADMIN,
                );
                toast.success("Role updated");
              } catch (e: any) {
                toast.error(e.message);
              }
            })
          }
        >
          Make {role === ROLE.ADMIN ? "User" : "Admin"}
        </Button>
      </div>

      {/* RIGHT: Danger Zone */}
      {role !== ROLE.ADMIN && (
        <div className="ml-auto">
          <Button
            size="sm"
            variant="destructive"
            disabled={pending}
            onClick={() =>
              startTransition(async () => {
                if (
                  !confirm(
                    "⚠️ This will permanently delete the user and ALL their media.\nThis action cannot be undone.\n\nContinue?",
                  )
                )
                  return;

                try {
                  await deleteUserAction(userId);
                  toast.success("User deleted permanently");
                } catch (e: any) {
                  toast.error(e.message);
                }
              })
            }
            className="gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Delete User & Assets
          </Button>
        </div>
      )}

      {/* ADMIN PROTECTION */}
      {role === ROLE.ADMIN && (
        <div className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
          <ShieldAlert className="h-4 w-4" />
          Admin accounts cannot be deleted
        </div>
      )}
    </div>
  );
};
