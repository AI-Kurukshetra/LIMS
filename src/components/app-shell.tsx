import type { ReactNode } from "react";

import { AppSidebar } from "@/components/app-sidebar";
import { DashboardHeader } from "@/components/dashboard-header";
import type { UserProfile } from "@/lib/auth";

type AppShellProps = {
  profile: UserProfile;
  children: ReactNode;
};

export function AppShell({ profile, children }: AppShellProps) {
  const userName = profile.full_name || profile.email;

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[300px_1fr]">
      <div className="hidden lg:block">
        <AppSidebar className="sticky top-0 h-screen" role={profile.role} />
      </div>
      <div className="min-w-0">
        <DashboardHeader userName={userName} userRole={profile.role} />
        <main className="px-4 py-8 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
