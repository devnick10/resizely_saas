import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAdminVideos } from "@/lib/data/admin/getVidoes";
import dayjs from "dayjs";

export const AdminVideosPage: React.FC = async () => {
  const videos = await getAdminVideos();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Videos</h1>
        <p className="text-sm text-muted-foreground">
          Uploaded and compressed videos
        </p>
      </div>

      <div className="rounded-md border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Original Size</TableHead>
              <TableHead>Compressed</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {videos.map((video) => (
              <TableRow key={video.id}>
                <TableCell className="font-medium">{video.title}</TableCell>

                <TableCell>{video.owner.username}</TableCell>

                <TableCell>{video.owner.email}</TableCell>

                <TableCell>
                  <Badge variant="secondary">{video.originalSize}</Badge>
                </TableCell>

                <TableCell>
                  <Badge variant="outline">{video.compressSize}</Badge>
                </TableCell>

                <TableCell>{video.duration.toFixed(1)}s</TableCell>

                <TableCell>
                  {dayjs(video.createdAt).format("DD MMM YYYY")}
                </TableCell>
              </TableRow>
            ))}

            {videos.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-sm">
                  No videos found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
