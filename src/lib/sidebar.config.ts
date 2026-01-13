import {
  Activity,
  BarChart3,
  Cloud,
  Database,
  Image,
  ImageIcon,
  LayoutDashboard,
  LayoutDashboardIcon,
  Share2Icon,
  UploadIcon,
  Users,
  UserX,
  Video,
} from "lucide-react";

export const USER_SIDEBAR_ITEMS = [
  { href: "/dashboard", icon: LayoutDashboardIcon, label: "Dashboard" },
  { href: "/tools/resize", icon: Share2Icon, label: "Image Resize" },
  { href: "/tools/video-compress", icon: UploadIcon, label: "Video Compress" },
  { href: "/tools/bg-removal", icon: ImageIcon, label: "Background Removal" },
];

export type AdminSidebarItem = {
  label: string;
  href?: string;
  icon: any;
  children?: AdminSidebarItem[];
};

export const adminSidebarConfig: AdminSidebarItem[] = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Users",
    icon: Users,
    children: [
      {
        label: "All Users",
        href: "/admin/users",
        icon: Users,
      },
      {
        label: "Blocked Users",
        href: "/admin/users/blocked",
        icon: UserX,
      },
    ],
  },
  {
    label: "Media",
    icon: Image,
    children: [
      {
        label: "All Media",
        href: "/admin/media",
        icon: Database,
      },
      {
        label: "Images",
        href: "/admin/media/images",
        icon: Image,
      },
      {
        label: "Videos",
        href: "/admin/media/videos",
        icon: Video,
      },
    ],
  },
  {
    label: "Analytics",
    icon: BarChart3,
    children: [
      {
        label: "Storage Usage",
        href: "/admin/analytics/storage",
        icon: Cloud,
      },
      {
        label: "Activity Logs",
        href: "/admin/analytics/activity",
        icon: Activity,
      },
    ],
  },
];
