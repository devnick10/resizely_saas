import { getUsersAdmin } from "@/lib/data/admin/getUsers";
import { UsersTable } from "@/components/admin/UsersTable";

export const AdminUsersPage: React.FC = async () => {
  const users = await getUsersAdmin();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Users</h1>
        <p className="text-sm text-muted-foreground">
          Manage platform users and roles
        </p>
      </div>

      <UsersTable users={users} />
    </div>
  );
};
