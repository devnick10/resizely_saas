"use client";

import dayjs from "dayjs";
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
import { BlockedUserRow } from "@/lib/data/admin/getBlockedUsers";

interface Props {
  users: BlockedUserRow[];
}

export const BlockedUsersTable: React.FC<Props> = ({ users }) => {
  return (
    <div className="rounded-md border bg-background">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Credits</TableHead>
            <TableHead>Blocked At</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.username}</TableCell>

              <TableCell>{user.email}</TableCell>

              <TableCell>
                <Badge variant="destructive">{user.role}</Badge>
              </TableCell>

              <TableCell>{user.credits}</TableCell>

              <TableCell>
                {user.blockedAt
                  ? dayjs(user.blockedAt).format("DD MMM YYYY")
                  : "-"}
              </TableCell>

              <TableCell className="space-x-2 text-right">
                <Button size="sm" variant="secondary">
                  Unblock
                </Button>
                <Button size="sm" variant="destructive">
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}

          {users.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-sm">
                No blocked users 🎉
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
