import type { ReactNode } from "react";

import { AppShell } from "@/components/app-shell";
import { requireUserProfile } from "@/lib/auth";

export default async function SamplesLayout({ children }: { children: ReactNode }) {
  const { profile } = await requireUserProfile(["lab_manager", "scientist", "client"]);

  return <AppShell profile={profile}>{children}</AppShell>;
}
