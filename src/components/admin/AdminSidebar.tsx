"use client";

import { adminSidebarConfig } from "@/lib/sidebar.config";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

export const AdminSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [openGroups, setOpenGroups] = useState<string[]>([]);

  const toggleGroup = (label: string) => {
    setOpenGroups((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label],
    );
  };

  return (
    <div className="flex h-full flex-col gap-2 p-4">
      {adminSidebarConfig.map((item) => {
        const isOpen = openGroups.includes(item.label);
        const Icon = item.icon;

        // 🔹 Simple link
        if (!item.children) {
          return (
            <Button
              key={item.label}
              variant={pathname === item.href ? "default" : "ghost"}
              className="w-full justify-start gap-2"
              onClick={() => router.push(item.href!)}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Button>
          );
        }

        // 🔹 Group
        return (
          <div key={item.label} className="space-y-1">
            <Button
              variant="ghost"
              className="w-full justify-between"
              onClick={() => toggleGroup(item.label)}
            >
              <span className="flex items-center gap-2">
                <Icon className="h-4 w-4" />
                {item.label}
              </span>
              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-transform",
                  isOpen && "rotate-180",
                )}
              />
            </Button>

            {isOpen && (
              <div className="ml-6 space-y-1">
                {item.children.map((child) => {
                  const ChildIcon = child.icon;
                  return (
                    <Button
                      key={child.label}
                      variant={pathname === child.href ? "secondary" : "ghost"}
                      className="w-full justify-start gap-2"
                      onClick={() => router.push(child.href!)}
                    >
                      <ChildIcon className="h-4 w-4" />
                      {child.label}
                    </Button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
