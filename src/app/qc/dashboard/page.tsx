import { AppShell } from "@/components/app-shell";
import { RoleDashboardShell } from "@/components/role-dashboard-shell";
import { requireUserProfile } from "@/lib/auth";
import { roleDashboardContent } from "@/lib/rbac";

export default async function QcDashboardPage() {
  const { profile } = await requireUserProfile(["qc_manager"]);

  return (
    <AppShell profile={profile}>
      <RoleDashboardShell profile={profile} {...roleDashboardContent.qc_manager} />
    </AppShell>
  );
}
