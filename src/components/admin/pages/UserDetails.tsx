import { getUserByIdAdmin } from "@/lib/data/admin/getUsersById";
import { AdminUserActions } from "@/components/admin/AdminUserActions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import dayjs from "dayjs";
import { Badge } from "@/components/ui/badge";

export const UserDetailsPage: React.FC<{ id: string }> = async ({ id }) => {
  const user = await getUserByIdAdmin(id);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold">User Details</h1>
        <p className="text-sm text-muted-foreground">
          Manage user account and activity
        </p>
      </div>

      {/* User Info */}
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2 text-sm">
          <div>
            <strong>Username:</strong> {user.username}
          </div>
          <div>
            <strong>Email:</strong> {user.email}
          </div>
          <div className="flex items-center gap-2">
            <strong>Status:</strong>
            <Badge variant={user.isBlocked ? "destructive" : "secondary"}>
              {user.isBlocked ? "Blocked" : "Active"}
            </Badge>
          </div>
          <div>
            <strong>Role:</strong> {user.role}
          </div>
          <div>
            <strong>Joined:</strong>{" "}
            {dayjs(user.createdAt).format("DD MMM YYYY")}
          </div>
        </CardContent>
      </Card>

      {/* Credits */}
      <Card>
        <CardHeader>
          <CardTitle>Credits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xl font-bold">{user.Credit?.credits ?? 0}</div>
        </CardContent>
      </Card>

      {/* Usage */}
      <Card>
        <CardHeader>
          <CardTitle>Usage</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Images</p>
            <p className="text-lg font-semibold">{user._count.images}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Videos</p>
            <p className="text-lg font-semibold">{user._count.videos}</p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Admin Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <AdminUserActions
            userId={user.id}
            isBlocked={user.isBlocked}
            role={user.role}
          />
        </CardContent>
      </Card>
    </div>
  );
};
