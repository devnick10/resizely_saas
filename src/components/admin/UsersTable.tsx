"use client";

import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { AdminUserRow } from "@/lib/data/admin/getUsers";

interface Props {
  users: AdminUserRow[];
}

export const UsersTable: React.FC<Props> = ({ users }) => {
  const router = useRouter();

  return (
    <div className="rounded-md border bg-background">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Credits</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {users.map((user) => (
            <TableRow
              key={user.id}
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => router.push(`/admin/users/${user.id}`)}
            >
              <TableCell className="font-medium">{user.username}</TableCell>

              <TableCell>{user.email}</TableCell>

              <TableCell>
                <Badge
                  variant={user.role === "ADMIN" ? "destructive" : "secondary"}
                >
                  {user.role}
                </Badge>
              </TableCell>

              <TableCell>{user.credits}</TableCell>

              <TableCell>
                {dayjs(user.createdAt).format("DD MMM YYYY")}
              </TableCell>

              {/* ACTIONS */}
              <TableCell
                className="space-x-2 text-right"
                onClick={(e) => e.stopPropagation()}
              >
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    router.push(`/admin/users/${user.id}?action=role`)
                  }
                >
                  Change Role
                </Button>

                <Button
                  size="sm"
                  variant={user.isBlocked ? "secondary" : "destructive"}
                  onClick={() =>
                    router.push(`/admin/users/${user.id}?action=block`)
                  }
                >
                  {user.isBlocked ? "Unblock" : "Block"}
                </Button>
              </TableCell>
            </TableRow>
          ))}

          {users.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-sm">
                No users found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
