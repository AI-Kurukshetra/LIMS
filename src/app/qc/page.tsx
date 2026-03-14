import { AppShell } from "@/components/app-shell";
import { ProtectedFeaturePage } from "@/components/protected-feature-page";
import { requireUserProfile } from "@/lib/auth";

export default async function QcPage() {
  const { profile } = await requireUserProfile(["qc_manager"]);

  return (
    <AppShell profile={profile}>
      <ProtectedFeaturePage
        profile={profile}
        title="Quality control approvals"
        description="QC-only route for quality review, approvals, and future release decisions."
        allowedRoles={["qc_manager"]}
        backHref="/qc/dashboard"
      />
    </AppShell>
  );
}
