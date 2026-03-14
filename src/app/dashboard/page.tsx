import { Activity, ArrowUpRight, Clock3, ShieldCheck, TestTube2, TimerReset } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const metrics = [
  { label: "Active samples", value: "1,248", change: "Updated live" },
  { label: "Queued tests", value: "34", change: "Ready to process" },
  { label: "Reports in review", value: "16", change: "Needs approval" },
  { label: "Clients waiting", value: "8", change: "Share updates" }
];

const activityFeed = [
  {
    title: "Stability panel completed",
    detail: "Batch B-24019 passed all controls and moved to review.",
    time: "9 minutes ago",
    icon: ShieldCheck
  },
  {
    title: "Sequencer calibration due",
    detail: "Instrument SQ-07 requires calibration before the next run.",
    time: "23 minutes ago",
    icon: TimerReset
  },
  {
    title: "New sample intake",
    detail: "24 hematology specimens were registered via intake portal.",
    time: "41 minutes ago",
    icon: TestTube2
  }
];

const complianceItems = [
  { label: "Audit trails intact", value: "100%" },
  { label: "Pending deviations", value: "2 open" },
  { label: "Reviewer SLA", value: "Under target" }
];

const managementTabs = [
  {
    title: "Sample Intake",
    detail: "Register incoming samples, client details, requested tests, and current handling status."
  },
  {
    title: "Doctor Review",
    detail: "Track reports waiting for doctor review and see which doctor the report is assigned to."
  },
  {
    title: "Bench Status",
    detail: "Follow what lab assistants are preparing, what is under testing, and what is waiting for entry."
  },
  {
    title: "Client Reports",
    detail: "Release only the finalized reports that the client portal should be allowed to see."
  }
];

const queueRows = [
  ["S-1004", "Acme Clinics", "Dr. Meera Shah", "Report drafting", "Lab Assistant"],
  ["S-1007", "Nova Care", "Dr. Arjun Rao", "Ready for doctor review", "Doctor"],
  ["S-1012", "BlueHealth", "Unassigned", "In testing", "Lab Assistant"],
  ["S-1019", "Prime Diagnostics", "Dr. Kavya Nair", "Released to client", "Client Portal"]
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <section className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <Card className="overflow-hidden border-0 bg-gradient-to-br from-[#0f4650] via-[#125965] to-[#2f9e9a] text-white">
          <CardHeader>
            <Badge variant="success" className="w-fit border-0 bg-white/10 text-[#d8fff5]">
              Operations nominal
            </Badge>
            <CardTitle className="mt-4 text-3xl text-white">
              Laboratory operations remain stable across intake, runs, and review.
            </CardTitle>
            <CardDescription className="max-w-2xl text-[#d2f0ed]">
              Monitor throughput, quality controls, and compliance posture from a single
              production-ready control plane.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {metrics.map((metric) => (
              <div key={metric.label} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <p className="text-sm text-[#d2f0ed]">{metric.label}</p>
                <div className="mt-3 flex items-end justify-between gap-3">
                  <p className="text-3xl font-semibold text-white">{metric.value}</p>
                  <span className="text-sm text-[#dfffae]">{metric.change}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-white/70 bg-[rgba(255,255,255,0.9)]">
          <CardHeader>
            <CardTitle>Basic Laboratory Tabs</CardTitle>
            <CardDescription>These are the main areas the operations dashboard should expose.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-[#55797c]">
            {managementTabs.map((tab) => (
              <div key={tab.title} className="rounded-2xl bg-[#e8f5f3] p-4">
                <p className="font-medium text-[#12343b]">{tab.title}</p>
                <p className="mt-1">{tab.detail}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_0.85fr]">
        <Card className="border-white/70 bg-[rgba(255,255,255,0.9)]">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Critical events across operations and QA.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {activityFeed.map((item, index) => {
              const Icon = item.icon;

              return (
                <div key={item.title}>
                  <div className="flex items-start gap-4">
                    <div className="rounded-2xl bg-[#e8f5f3] p-3">
                      <Icon className="h-5 w-5 text-[#145761]" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-semibold text-[#12343b]">{item.title}</p>
                          <p className="mt-1 text-sm leading-6 text-[#55797c]">{item.detail}</p>
                        </div>
                        <p className="whitespace-nowrap text-sm text-[#6c8d90]">{item.time}</p>
                      </div>
                    </div>
                  </div>
                  {index < activityFeed.length - 1 ? <Separator className="mt-5" /> : null}
                </div>
              );
            })}
          </CardContent>
        </Card>

        <div className="grid gap-6">
          <Card className="border-white/70 bg-[rgba(255,255,255,0.9)]">
            <CardHeader>
              <CardTitle>Work Queue Snapshot</CardTitle>
              <CardDescription>
                A simple founder-readable queue showing samples, doctor assignment, and release state.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto rounded-2xl border border-border/70">
                <table className="min-w-full border-collapse text-left text-sm">
                  <thead className="bg-[#f3fbf9] text-[#4f7a7f]">
                    <tr>
                      {["Sample", "Client", "Assigned Doctor", "Status", "Visible To"].map((item) => (
                        <th key={item} className="px-4 py-3 font-semibold">
                          {item}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {queueRows.map((row, index) => (
                      <tr key={`${row[0]}-${index}`} className="border-t border-border/70">
                        {row.map((cell) => (
                          <td key={`${cell}-${index}`} className="px-4 py-3 text-[#12343b]">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/70 bg-[rgba(255,255,255,0.9)]">
            <CardHeader>
              <CardTitle>Compliance Snapshot</CardTitle>
              <CardDescription>Operational guardrails for regulated labs.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {complianceItems.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between rounded-2xl border border-border/70 p-4"
                >
                  <span className="text-sm text-[#55797c]">{item.label}</span>
                  <span className="font-semibold text-[#12343b]">{item.value}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-white/70 bg-[rgba(255,255,255,0.9)]">
            <CardHeader>
              <CardTitle>Daily Work Trend</CardTitle>
              <CardDescription>Simple view of how activity is moving across the week.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex h-56 items-end gap-3 rounded-2xl bg-[#e8f5f3] p-6">
                {[52, 74, 61, 88, 79, 98, 92].map((height, index) => (
                  <div key={height + index} className="flex flex-1 flex-col items-center gap-3">
                    <div
                      className="w-full rounded-t-2xl bg-gradient-to-t from-[#0f4650] to-[#65d7cf]"
                      style={{ height: `${height * 1.5}px` }}
                    />
                    <span className="text-xs font-medium uppercase tracking-[0.18em] text-[#6c8d90]">
                      D{index + 1}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center gap-2 text-sm text-[#55797c]">
                <Activity className="h-4 w-4" />
                Weekly processing volume is trending upward.
                <ArrowUpRight className="h-4 w-4 text-[#1e8f69]" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/70 bg-[rgba(255,255,255,0.9)]">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="rounded-2xl bg-[#e8f5f3] p-3">
                <Clock3 className="h-5 w-5 text-[#145761]" />
              </div>
              <div>
                <p className="font-semibold text-[#12343b]">Designed for laboratory management</p>
                <p className="text-sm text-[#55797c]">
                  Managers can see samples, doctor assignment, report readiness, and client release
                  status in a single operating view.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
