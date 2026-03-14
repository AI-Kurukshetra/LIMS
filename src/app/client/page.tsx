import { AppShell } from "@/components/app-shell";
import { ProtectedFeaturePage } from "@/components/protected-feature-page";
import { requireUserProfile } from "@/lib/auth";

export default async function ClientPortalPage() {
  const { profile } = await requireUserProfile(["client"]);

  return (
    <AppShell profile={profile}>
      <ProtectedFeaturePage
        profile={profile}
        title="Client portal"
        description="Client-only route for sample status tracking and final report access."
        allowedRoles={["client"]}
        backHref="/client/dashboard"
      />
    </AppShell>
  );
}
