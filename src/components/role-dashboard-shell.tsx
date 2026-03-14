import Link from "next/link";
import { ArrowRight, Beaker, ShieldCheck, TestTube2 } from "lucide-react";

import { AlertCard } from "@/components/dashboard/alert-card";
import { DataTable } from "@/components/dashboard/data-table";
import { StatCard } from "@/components/dashboard/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { roleLabels, type DashboardNavigationItem } from "@/lib/rbac";
import type { UserProfile } from "@/lib/auth";

type RoleDashboardShellProps = {
  profile: UserProfile;
  title: string;
  description: string;
  workspaceLabel: string;
  persona: string;
  summary: string;
  metrics: Array<{ label: string; value: string; note: string }>;
  tabs: Array<{ name: string; detail: string }>;
  updates: Array<{ title: string; detail: string; time: string }>;
  navigation: DashboardNavigationItem[];
};

export function RoleDashboardShell({
  profile,
  title,
  description,
  workspaceLabel,
  persona,
  summary,
  metrics,
  tabs,
  updates,
  navigation
}: RoleDashboardShellProps) {
  const displayName = profile.full_name || profile.email;
  const initial = displayName.trim().charAt(0).toUpperCase() || "U";
  const sampleRows = tabs.map((tab, index) => [
    `${index + 1}`,
    tab.name,
    tab.detail,
    roleLabels[profile.role]
  ]);

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 rounded-[2rem] border border-white/70 bg-white/75 p-6 shadow-soft backdrop-blur xl:flex-row xl:items-center xl:justify-between">
        <div className="space-y-4">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="success" className="border-0 bg-[#e2fbf5] text-[#0f6a58]">
                {roleLabels[profile.role]}
              </Badge>
              <Badge variant="secondary" className="border-0 bg-[#edf7f5] text-[#145761]">
                {workspaceLabel}
              </Badge>
            </div>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[#12343b]">
              {title}
            </h1>
            <p className="mt-3 max-w-3xl text-base leading-7 text-[#55797c]">{description}</p>
          </div>
        </div>
        <div className="rounded-3xl bg-gradient-to-br from-[#0f4650] via-[#12616b] to-[#4eb9b3] p-6 text-white xl:max-w-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-white/10 text-xl font-semibold">
              {initial}
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-[#cef8f5]">Welcome</p>
              <p className="mt-1 text-xs uppercase tracking-[0.22em] text-[#c9f3ef]">
                {roleLabels[profile.role]}
              </p>
            </div>
          </div>
          <p className="mt-3 text-2xl font-semibold">{displayName}</p>
          <p className="mt-1 text-sm uppercase tracking-[0.22em] text-[#c9f3ef]">{persona}</p>
          <p className="mt-2 text-sm leading-6 text-[#d8f6f3]">
            This dashboard only shows the areas mapped to your current role, so users stay in
            the right workflow.
          </p>
        </div>
      </header>

      <section className="mt-8 grid gap-4 md:grid-cols-3">
        {metrics.map((metric) => (
          <StatCard key={metric.label} {...metric} />
        ))}
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="border-white/70 bg-white/85">
          <CardHeader>
            <CardTitle>Role Navigation</CardTitle>
            <CardDescription>
              Each card points to a route this role is expected to use.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-2xl border border-border/70 bg-[#f8fcfb] p-5 transition-colors hover:bg-[#eef8f6]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <div className="rounded-2xl bg-[#e8f5f3] p-2.5">
                        <item.icon className="h-4 w-4 text-[#145761]" />
                      </div>
                      <p className="text-base font-semibold text-[#12343b]">{item.title}</p>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-[#55797c]">{item.description}</p>
                  </div>
                  <ArrowRight className="mt-1 h-5 w-5 text-[#145761]" />
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>

        <div className="grid gap-6">
          <Card className="border-white/70 bg-white/85">
            <CardHeader>
              <CardTitle>Role Summary</CardTitle>
              <CardDescription>Plain-English notes for the founder and future team.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm leading-6 text-[#55797c]">
              <div className="rounded-2xl bg-[#e8f5f3] p-4">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-5 w-5 text-[#145761]" />
                  <p className="font-medium text-[#12343b]">Access is enforced at the route level</p>
                </div>
                <p className="mt-2">
                  Middleware checks the signed-in user&apos;s profile before the protected page is
                  shown.
                </p>
              </div>
              <div className="rounded-2xl bg-[#e8f5f3] p-4">
                <div className="flex items-center gap-3">
                  <Beaker className="h-5 w-5 text-[#145761]" />
                  <p className="font-medium text-[#12343b]">Current role focus</p>
                </div>
                <p className="mt-2">{summary}</p>
              </div>
              <div className="rounded-2xl bg-[#e8f5f3] p-4">
                <div className="flex items-center gap-3">
                  <TestTube2 className="h-5 w-5 text-[#145761]" />
                  <p className="font-medium text-[#12343b]">Profiles live in PostgreSQL</p>
                </div>
                <p className="mt-2">
                  The `profiles` table stores the role and contact details linked to the auth user.
                </p>
              </div>
              <div className="rounded-2xl bg-[#e8f5f3] p-4">
                <div className="flex items-center gap-3">
                  <Beaker className="h-5 w-5 text-[#145761]" />
                  <p className="font-medium text-[#12343b]">The structure is ready for future modules</p>
                </div>
                <p className="mt-2">
                  Samples, results, quality, reports, and client portal pages can all reuse the
                  same permission helpers.
                </p>
              </div>
            </CardContent>
          </Card>

          <Button asChild size="lg" className="justify-between">
            <Link href="/">Return to home</Link>
          </Button>
        </div>
      </section>

      <section className="mt-8 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <DataTable
          title="Primary Tabs"
          description="These are the basic areas this role should work with first."
          columns={["#", "Tab", "Purpose", "Role"]}
          rows={sampleRows}
        />
        <div className="grid gap-4">
          {updates.map((update) => (
            <AlertCard key={`${update.title}-${update.time}`} {...update} />
          ))}
        </div>
      </section>
    </div>
  );
}
