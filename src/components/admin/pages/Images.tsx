import { getAdminImages } from "@/lib/data/admin/getImages";
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

export const AdminImagesPage: React.FC = async () => {
  const images = await getAdminImages();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Images</h1>
        <p className="text-sm text-muted-foreground">
          Original images uploaded by users
        </p>
      </div>

      <div className="rounded-md border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Public ID</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Transforms</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {images.map((img) => (
              <TableRow key={img.id}>
                <TableCell className="font-mono text-xs">
                  {img.publicId}
                </TableCell>

                <TableCell>{img.owner.username}</TableCell>

                <TableCell>{img.owner.email}</TableCell>

                <TableCell>
                  <Badge variant="secondary">{img.transformationsCount}</Badge>
                </TableCell>

                <TableCell>
                  {dayjs(img.createdAt).format("DD MMM YYYY")}
                </TableCell>
              </TableRow>
            ))}

            {images.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-sm">
                  No images found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
