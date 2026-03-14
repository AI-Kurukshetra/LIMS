import { AppShell } from "@/components/app-shell";
import { ProtectedFeaturePage } from "@/components/protected-feature-page";
import { requireUserProfile } from "@/lib/auth";

export default async function AdminUsersPage() {
  const { profile } = await requireUserProfile(["admin"]);

  return (
    <AppShell profile={profile}>
      <ProtectedFeaturePage
        profile={profile}
        title="User administration"
        description="Admin-only route for user management, role review, and future account approvals."
        allowedRoles={["admin"]}
        backHref="/admin/dashboard"
      />
    </AppShell>
  );
}
