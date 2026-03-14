import { AppShell } from "@/components/app-shell";
import { ProtectedFeaturePage } from "@/components/protected-feature-page";
import { requireUserProfile } from "@/lib/auth";

export default async function AdminReportsPage() {
  const { profile } = await requireUserProfile(["admin"]);

  return (
    <AppShell profile={profile}>
      <ProtectedFeaturePage
        profile={profile}
        title="Reports"
        description="Admin-only route for top-level reporting, export controls, and future audit summaries."
        allowedRoles={["admin"]}
        backHref="/admin/dashboard"
      />
    </AppShell>
  );
}
