import { redirect } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, ClipboardList, FlaskConical, Users } from "lucide-react";

import { AppLogo } from "@/components/app-logo";
import { AuthForm } from "@/components/auth-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getOptionalSessionProfile } from "@/lib/auth";
import { getDashboardPathForRole } from "@/lib/rbac";
import { isSupabaseConfigured } from "@/lib/supabase/config";

const highlights = [
  {
    title: "Connected operational control",
    description: "Keep samples, testing activity, reports, and inventory aligned in one system.",
    icon: FlaskConical
  },
  {
    title: "Faster daily execution",
    description: "Move from registration to review with clear status, ownership, and traceability.",
    icon: ClipboardList
  },
  {
    title: "Built for every lab stakeholder",
    description: "Support managers, scientists, reviewers, quality teams, and clients with focused workspaces.",
    icon: Users
  }
];

export default async function LoginPage({
  searchParams
}: {
  searchParams?: { error?: string };
}) {
  if (isSupabaseConfigured) {
    const { profile } = await getOptionalSessionProfile();

    if (profile) {
      redirect(getDashboardPathForRole(profile.role));
    }
  }

  const showProfileError = searchParams?.error === "profile";

  return (
    <main className="container grid min-h-screen items-center gap-10 py-12 lg:grid-cols-[1.1fr_0.9fr]">
      <section className="space-y-8">
        <AppLogo />
        <div className="space-y-5">
          <p className="font-mono text-sm uppercase tracking-[0.28em] text-slate-500">
            Laboratory Operations Platform
          </p>
          <h1 className="max-w-3xl text-5xl font-semibold tracking-tight text-slate-950">
            Run laboratory operations from sample intake to final report in LabAxis.
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-slate-600">
            LabAxis gives commercial, diagnostic, and research laboratories a clear system for
            testing workflows, reporting, inventory visibility, and compliance-ready execution.
          </p>
        </div>

        <div className="grid gap-4">
          {highlights.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="rounded-2xl border border-white/70 bg-white/80 p-5 shadow-soft"
              >
                <div className="flex items-start gap-4">
                  <div className="rounded-2xl bg-slate-950 p-3 text-white">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-base font-semibold text-slate-950">{item.title}</p>
                    <p className="mt-1 text-sm leading-6 text-slate-600">{item.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="rounded-2xl border border-dashed border-border bg-white/60 p-5 text-sm text-slate-600">
          <div className="flex items-center gap-2 font-semibold text-slate-950">
            <CheckCircle2 className="h-4 w-4" />
            Designed for adoption
          </div>
          <p className="mt-2 leading-6">
            The sign-in experience is intentionally straightforward so teams can adopt the platform
            quickly while still supporting structured workflows, controlled reviews, and
            operational accountability.
          </p>
        </div>
        {showProfileError ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-950">
            Your auth account was found, but the matching `profiles` row is missing. Run the
            RBAC SQL migration in Supabase, then sign in again so the app can read the user role.
          </div>
        ) : null}
      </section>

      <Card className="w-full border-white/80 bg-white/90">
        <CardHeader>
          <CardTitle>Access your LabAxis workspace</CardTitle>
          <CardDescription>
            Sign in or create an account to open the right role-based environment.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <AuthForm />
          {!isSupabaseConfigured ? null : null}
          <Button asChild variant="ghost" className="w-full">
            <Link href="/">Back to home</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
