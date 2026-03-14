import type { ReactNode } from "react";

import { AppShell } from "@/components/app-shell";
import { requireUserProfile } from "@/lib/auth";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  // This shared operations dashboard is only for admins and lab managers.
  const { profile } = await requireUserProfile(["admin", "lab_manager"]);

  return <AppShell profile={profile}>{children}</AppShell>;
}
