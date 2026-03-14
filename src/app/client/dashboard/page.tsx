import { AppShell } from "@/components/app-shell";
import { RoleDashboardShell } from "@/components/role-dashboard-shell";
import { requireUserProfile } from "@/lib/auth";
import { roleDashboardContent } from "@/lib/rbac";

export default async function ClientDashboardPage() {
  const { profile } = await requireUserProfile(["client"]);

  return (
    <AppShell profile={profile}>
      <RoleDashboardShell profile={profile} {...roleDashboardContent.client} />
    </AppShell>
  );
}
