import { getActivityLogs } from "@/lib/data/admin/getActivityLogs";
import dayjs from "dayjs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export const ActivityLogsPage: React.FC = async () => {
  const logs = await getActivityLogs(50);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Activity Logs</h1>
        <p className="text-sm text-muted-foreground">
          Administrative actions performed on the platform
        </p>
      </div>

      <div className="rounded-md border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Admin</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Target</TableHead>
              <TableHead>Time</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {logs.map((log) => (
              <TableRow key={log.id}>
                <TableCell>
                  <div className="font-medium">{log.admin.username}</div>
                  <div className="text-xs text-muted-foreground">
                    {log.admin.email}
                  </div>
                </TableCell>

                <TableCell>
                  <Badge variant="secondary">{log.action}</Badge>
                </TableCell>

                <TableCell>
                  {log.targetId ?? (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>

                <TableCell>
                  {dayjs(log.createdAt).format("DD MMM YYYY, HH:mm")}
                </TableCell>
              </TableRow>
            ))}

            {logs.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-sm">
                  No activity recorded
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
