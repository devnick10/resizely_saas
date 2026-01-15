import { getStorageAnalytics } from "@/lib/data/admin/getStorageAnalytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cloud, Image, Video, HardDrive, Layers, Cpu } from "lucide-react";

export const StorageAnalyticsPage: React.FC = async () => {
  const data = await getStorageAnalytics();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold">Storage Usage</h1>
        <p className="text-sm text-muted-foreground">
          Cloudinary & platform storage overview
        </p>
      </div>

      {/* Cloudinary Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          title="Storage Used"
          value={`${data.cloudinary.storageMB} MB`}
          icon={HardDrive}
        />
        <Stat
          title="Bandwidth Used"
          value={`${data.cloudinary.bandwidthMB} MB`}
          icon={Cloud}
        />
        <Stat
          title="Total Assets"
          value={data.cloudinary.totalAssets}
          icon={Layers}
        />
        <Stat
          title="Transformations"
          value={data.cloudinary.transformations}
          icon={Cpu}
        />
      </div>

      {/* Database Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Database Assets</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <DbStat label="Images" value={data.database.images} icon={Image} />
          <DbStat label="Videos" value={data.database.videos} icon={Video} />
          <DbStat label="Derived" value={data.database.derived} />
          <DbStat label="Irreversible" value={data.database.irreversible} />
        </CardContent>
      </Card>

      {/* Credits & AI */}
      <Card>
        <CardHeader>
          <CardTitle>Usage Limits</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div>
            Credits Used:{" "}
            <strong>
              {data.cloudinary.creditsUsed} / {data.cloudinary.creditsLimit}
            </strong>
          </div>
          <div>
            AI Usage:{" "}
            <strong>
              {data.cloudinary.aiUsed} / {data.cloudinary.aiLimit}
            </strong>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

/* ---------- UI Helpers ---------- */

function Stat({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: string | number;
  icon: any;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}

function DbStat({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon?: any;
}) {
  return (
    <div className="flex items-center gap-3">
      {Icon && <Icon className="h-5 w-5 text-muted-foreground" />}
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-lg font-semibold">{value}</p>
      </div>
    </div>
  );
}
