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
    title: "Sample and patient work in one place",
    description: "Keep sample details, testing steps, results, and reports connected in one system.",
    icon: TestTube2
  },
  {
    title: "Easy for every user role",
    description: "Designed for doctors, lab teams, reviewers, and client users with simple screens.",
    icon: UserRound
  },
  {
    title: "Clear and traceable work",
    description: "Help teams follow each step with status tracking, reviews, and controlled access.",
    icon: ShieldCheck
  }
];

const platformAreas = [
  {
    title: "Scientific informatics foundation",
    description:
      "Bring samples, methods, results, specifications, and reporting into a single operational model.",
    icon: DatabaseZap
  },
  {
    title: "Instrument-aware workflows",
    description:
      "Support analyzers, sequencers, and lab equipment with clear run status, calibration, and handoff checkpoints.",
    icon: FlaskConical
  },
  {
    title: "Quality and compliance controls",
    description:
      "Keep audit readiness in focus with controlled review steps, traceability, and role-based access.",
    icon: ShieldCheck
  }
];

const useCases = [
  {
    title: "Why labs use this portal",
    description:
      "It reduces status confusion by keeping sample intake, report drafting, doctor review, and client visibility in one connected workflow.",
    icon: ClipboardCheck
  },
  {
    title: "What the portal includes",
    description:
      "Core modules cover sample registration, testing progress, report entry, doctor assignment, approvals, and released reports.",
    icon: Microscope
  },
  {
    title: "Who can use it",
    description:
      "Admins, lab managers, doctors, lab assistants, QC managers, and clients each see a focused workspace built for their role.",
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
              Laboratory Portal And Management System
            </p>
            <h1 className="mt-6 max-w-3xl text-5xl font-semibold tracking-tight text-[#12343b] sm:text-6xl">
              Launch laboratory operations, doctor review, and client reporting from one clean portal.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#55797c]">
              This launch page explains what the product does, why labs need it, and who should
              use each workspace before they sign in.
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
              <p className="font-semibold text-[#12343b]">Basic portal purpose</p>
              <p className="mt-2">
                The product helps laboratories manage sample flow, report preparation, doctor
                review, approvals, and client report access from one controlled platform.
              </p>
            </div>
          </div>

          <Card className="border-white/70 bg-white/85 shadow-soft">
            <CardContent className="grid gap-6 p-6">
              <div className="rounded-2xl bg-gradient-to-br from-[#0f4650] via-[#12616b] to-[#2f9e9a] p-6 text-white">
                <p className="text-sm text-[#d6f4f2]">Main launch page</p>
                <div className="mt-4 flex items-end gap-3">
                  <span className="text-5xl font-semibold">Labs</span>
                  <span className="pb-2 text-sm text-[#d5ffbf]">reports, reviews, and portal access</span>
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
              Launch Overview
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[#12343b]">
              A founder-friendly home screen that explains the portal before the user signs in.
            </h2>
            <p className="mt-4 text-lg leading-8 text-[#55797c]">
              The first screen should make it clear that laboratories can use the product for
              sample handling, doctors can review assigned reports, lab assistants can update
              processing details, and clients can only see their own released reports.
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
