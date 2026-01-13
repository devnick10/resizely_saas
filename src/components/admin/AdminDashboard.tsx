"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Image, Video, Coins } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type StatsProps = {
  users: number;
  images: number;
  videos: number;
  creditsUsed: number;
};

type UsageItem = {
  date: string;
  images: number;
  videos: number;
};

interface AdminDashboardProps {
  stats: StatsProps;
  usageData: UsageItem[];
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  stats,
  usageData,
}) => {
  const cards = [
    { title: "Total Users", value: stats.users, icon: Users },
    { title: "Images Processed", value: stats.images, icon: Image },
    { title: "Videos Processed", value: stats.videos, icon: Video },
    { title: "Credits Used", value: stats.creditsUsed, icon: Coins },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Overview of platform usage and activity
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Usage</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={usageData}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="images" />
              <Bar dataKey="videos" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
