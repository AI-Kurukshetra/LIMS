import { AppShell } from "@/components/app-shell";
import { RoleDashboardShell } from "@/components/role-dashboard-shell";
import { requireUserProfile } from "@/lib/auth";
import { roleDashboardContent } from "@/lib/rbac";

export default async function ManagerDashboardPage() {
  const { profile } = await requireUserProfile(["lab_manager"]);

  return (
    <AppShell profile={profile}>
      <RoleDashboardShell profile={profile} {...roleDashboardContent.lab_manager} />
    </AppShell>
  );
}
