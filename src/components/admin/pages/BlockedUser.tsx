import { getBlockedUsersAdmin } from "@/lib/data/admin/getBlockedUsers";
import { BlockedUsersTable } from "@/components/admin/BlockedUserTable";

export default async function BlockedUsersPage() {
  const users = await getBlockedUsersAdmin();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Blocked Users</h1>
        <p className="text-sm text-muted-foreground">
          Users restricted from accessing the platform
        </p>
      </div>

      <BlockedUsersTable users={users} />
    </div>
  );
}
