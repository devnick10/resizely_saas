import { getAdminMedia } from "@/lib/data/admin/getMedia";
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
import { DeleteMediaButton } from "../DeleteMediaButton";

export const AdminMediaPage: React.FC = async () => {
  const media = await getAdminMedia();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Media</h1>
        <p className="text-sm text-muted-foreground">
          All images and videos uploaded by users
        </p>
      </div>

      <div className="rounded-md border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Public ID</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {media.map((item) => (
              <TableRow key={`${item.type}-${item.id}`}>
                <TableCell>
                  <Badge
                    variant={item.type === "IMAGE" ? "secondary" : "outline"}
                  >
                    {item.type}
                  </Badge>
                </TableCell>

                <TableCell className="font-mono text-xs">
                  {item.publicId}
                </TableCell>

                <TableCell>{item.owner.username}</TableCell>

                <TableCell>{item.owner.email}</TableCell>

                <TableCell>
                  {dayjs(item.createdAt).format("DD MMM YYYY")}
                </TableCell>
                <TableCell className="text-right">
                  <DeleteMediaButton id={item.id} type={item.type} />
                </TableCell>
              </TableRow>
            ))}

            {media.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-sm">
                  No media found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
