import { AppShell } from "@/components/app-shell";
import { RoleDashboardShell } from "@/components/role-dashboard-shell";
import { requireUserProfile } from "@/lib/auth";
import { roleDashboardContent } from "@/lib/rbac";

export default async function AdminDashboardPage() {
  const { profile } = await requireUserProfile(["admin"]);

  return (
    <AppShell profile={profile}>
      <RoleDashboardShell profile={profile} {...roleDashboardContent.admin} />
    </AppShell>
  );
}
