import { AppShell } from "@/components/app-shell";
import { ProtectedFeaturePage } from "@/components/protected-feature-page";
import { requireUserProfile } from "@/lib/auth";

export default async function AdminSettingsPage() {
  const { profile } = await requireUserProfile(["admin"]);

  return (
    <AppShell profile={profile}>
      <ProtectedFeaturePage
        profile={profile}
        title="System settings"
        description="Admin-only route for platform settings, environment choices, and future tenant configuration."
        allowedRoles={["admin"]}
        backHref="/admin/dashboard"
      />
    </AppShell>
  );
}
