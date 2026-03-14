"use client";

import Link from "next/link";
import {
  LayoutGrid
} from "lucide-react";
import { usePathname } from "next/navigation";

import { AppLogo } from "@/components/app-logo";
import { Badge } from "@/components/ui/badge";
import { roleDashboardContent, roleLabels, type AppRole } from "@/lib/rbac";
import { cn } from "@/lib/utils";

export function AppSidebar({
  className,
  role
}: {
  className?: string;
  role: AppRole;
}) {
  const pathname = usePathname();
  const content = roleDashboardContent[role];
  const homeHref = role === "admin" || role === "lab_manager" ? "/dashboard" : `/${role === "qc_manager" ? "qc" : role}/dashboard`;
  const navigation = [
    {
      title: "Dashboard",
      href: homeHref,
      description: "Open the main screen for your role.",
      icon: LayoutGrid
    },
    ...content.navigation.filter((item) => item.href !== homeHref)
  ];

  return (
    <aside
      className={cn(
        "flex h-full flex-col border-r border-border/70 bg-[rgba(247,252,251,0.88)] px-4 py-6 backdrop-blur-xl",
        className
      )}
    >
      <AppLogo />
      <div className="mt-8 rounded-2xl border border-[#1f5962]/10 bg-[#12353d] p-5 text-white shadow-soft">
        <Badge variant="success" className="border-0 bg-[#6fe0d3]/15 text-[#b9fff6]">
          {roleLabels[role]}
        </Badge>
      </div>
      <nav className="mt-6 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={`${item.title}-${item.href}`}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors",
                isActive
                  ? "bg-[#12353d] text-white"
                  : "text-[#55797c] hover:bg-[#e8f5f3] hover:text-[#12343b]"
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto rounded-2xl border border-dashed border-border bg-white/70 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#4f7a7f]">
          Role
        </p>
        <p className="mt-2 text-sm font-medium text-[#12343b]">{content.persona}</p>
      </div>
    </aside>
  );
}
