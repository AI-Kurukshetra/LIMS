import Link from "next/link";
import {
  ArrowRight,
  ClipboardCheck,
  DatabaseZap,
  FileText,
  FlaskConical,
  Microscope,
  ShieldCheck,
  TestTube2,
  UserRound
} from "lucide-react";

import { AppLogo } from "@/components/app-logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const highlights = [
  {
    title: "Connected sample lifecycle",
    description:
      "Track intake, testing, review, and release in one operational flow without fragmented tools.",
    icon: TestTube2
  },
  {
    title: "Role-based clarity",
    description:
      "Give each team a focused workspace while leadership keeps visibility across the full lab.",
    icon: UserRound
  },
  {
    title: "Audit-ready execution",
    description:
      "Support traceability, controlled reviews, and compliance-driven operations from day one.",
    icon: ShieldCheck
  }
];

const platformAreas = [
  {
    title: "Operational data foundation",
    description:
      "Bring samples, methods, results, specifications, and reporting into a single source of truth.",
    icon: DatabaseZap
  },
  {
    title: "Workflow control across the bench",
    description:
      "Coordinate analyzers, handoffs, and lab activities with visible status, checkpoints, and ownership.",
    icon: FlaskConical
  },
  {
    title: "Quality and compliance by design",
    description:
      "Embed review steps, traceability, and access control into the platform instead of managing them manually.",
    icon: ShieldCheck
  }
];

const useCases = [
  {
    title: "Why buyers choose LabAxis",
    description:
      "It replaces status confusion and disconnected spreadsheets with one system for operational control.",
    icon: ClipboardCheck
  },
  {
    title: "What the platform covers",
    description:
      "Core workflows include sample registration, testing progress, reporting, approvals, inventory, and client access.",
    icon: Microscope
  },
  {
    title: "Who it is built for",
    description:
      "Lab managers, scientists, reviewers, quality teams, and clients each work inside a purpose-built interface.",
    icon: FileText
  }
];

export default function HomePage() {
  return (
    <main className="relative overflow-hidden">
      <div className="absolute inset-0 bg-hero-grid bg-hero-grid opacity-40" />
      <div className="container relative flex min-h-screen flex-col py-8">
        <header className="flex items-center justify-between">
          <AppLogo />
          <div className="flex items-center gap-3">
            <Button asChild variant="ghost">
              <Link href="/login">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/login">
                Create Account
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </header>

        <section className="grid flex-1 items-center gap-12 py-20 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <p className="font-mono text-sm uppercase tracking-[0.3em] text-[#4f7a7f]">
              Laboratory Operations Platform
            </p>
            <h1 className="mt-6 max-w-3xl text-5xl font-semibold tracking-tight text-[#12343b] sm:text-6xl">
              Run the modern laboratory from sample intake to signed report.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#55797c]">
              LabAxis gives growing laboratories one platform for operational control, testing
              workflows, reporting, inventory visibility, and compliance-ready execution.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Button asChild size="lg">
                <Link href="/login">
                  Sign In To Workspace
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/login">Register New Account</Link>
              </Button>
            </div>
            <div className="mt-8 rounded-2xl border border-white/70 bg-white/70 p-5 text-sm leading-6 text-[#55797c] shadow-soft">
              <p className="font-semibold text-[#12343b]">Why LabAxis stands out</p>
              <p className="mt-2">
                LabAxis combines sample management, testing operations, reporting, inventory, and
                compliance workflows in one product buyers can understand immediately.
              </p>
            </div>
          </div>

          <Card className="border-white/70 bg-white/85 shadow-soft">
            <CardContent className="grid gap-6 p-6">
              <div className="rounded-2xl bg-gradient-to-br from-[#0f4650] via-[#12616b] to-[#2f9e9a] p-6 text-white">
                <p className="text-sm text-[#d6f4f2]">LabAxis platform</p>
                <div className="mt-4 flex items-end gap-3">
                  <span className="text-5xl font-semibold">LabAxis</span>
                  <span className="pb-2 text-sm text-[#d5ffbf]">control, quality, and reporting</span>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                {highlights.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div key={item.title} className="rounded-2xl border border-border/80 bg-[#f8fcfb] p-5">
                      <Icon className="h-5 w-5 text-[#145761]" />
                      <h2 className="mt-4 text-base font-semibold text-[#12343b]">
                        {item.title}
                      </h2>
                      <p className="mt-2 text-sm leading-6 text-[#55797c]">
                        {item.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="pb-16">
          <div className="max-w-3xl">
            <p className="font-mono text-sm uppercase tracking-[0.28em] text-[#4f7a7f]">
              Product Overview
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[#12343b]">
              A product story that feels credible before the buyer ever signs in.
            </h2>
            <p className="mt-4 text-lg leading-8 text-[#55797c]">
              The homepage now positions LabAxis as a sellable laboratory operations platform with
              clear business value, clear workflow coverage, and clear audience fit across the lab.
            </p>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {useCases.map((item) => {
              const Icon = item.icon;

              return (
                <Card key={item.title} className="border-white/70 bg-white/85 shadow-soft">
                  <CardContent className="p-6">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#e8f5f3]">
                      <Icon className="h-5 w-5 text-[#145761]" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-[#12343b]">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-[#55797c]">{item.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {platformAreas.map((item) => {
              const Icon = item.icon;

              return (
                <Card key={item.title} className="border-white/70 bg-[#f8fcfb] shadow-soft">
                  <CardContent className="p-6">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white">
                      <Icon className="h-5 w-5 text-[#145761]" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-[#12343b]">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-[#55797c]">{item.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
