import Link from "next/link";
import { ArrowRight, FilePlus2, FlaskConical, TestTube2 } from "lucide-react";

import { DataTable } from "@/components/dashboard/data-table";
import { StatCard } from "@/components/dashboard/stat-card";
import { SampleStatusBadge } from "@/components/samples/sample-status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { requireUserProfile } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getRecords, type SampleStatus, type SampleSummary } from "@/lib/samples";

export default async function SamplesPage() {
  const { profile } = await requireUserProfile(["lab_manager", "scientist", "client"]);
  const supabase = createSupabaseServerClient();
  const { data } = await getRecords(supabase, profile);
  const samples: SampleSummary[] = data;

  const statusCounts = samples.reduce(
    (accumulator: Record<SampleStatus, number>, sample: SampleSummary) => {
      accumulator[sample.status] += 1;
      return accumulator;
    },
    {
      received: 0,
      in_testing: 0,
      qc_review: 0,
      approved: 0,
      completed: 0
    }
  );

  const rows = samples.map((sample: SampleSummary) => [
    <Link key={`${sample.id}-link`} href={`/samples/${sample.id}`} className="font-semibold text-[#145761] underline-offset-4 hover:underline">
      {sample.id.slice(0, 8)}
    </Link>,
    sample.sample_name,
    sample.client?.full_name ?? "Unknown client",
    sample.test_type,
    <SampleStatusBadge key={`${sample.id}-status`} status={sample.status} />,
    new Date(sample.created_at).toLocaleDateString()
  ]);

  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-4 rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-soft lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-3">
          <Badge variant="secondary" className="w-fit border-0 bg-[#edf7f5] text-[#145761]">
            Sample Management
          </Badge>
          <h1 className="text-4xl font-semibold tracking-tight text-[#12343b]">
            Sample operations for {profile.full_name || profile.email}
          </h1>
          <p className="max-w-3xl text-base leading-7 text-[#55797c]">
            This module lets the lab manager create and manage samples, while scientists and
            clients only see the records visible to their role.
          </p>
        </div>
        {profile.role === "lab_manager" ? (
          <Button asChild size="lg">
            <Link href="/samples/create">
              Create Sample
              <FilePlus2 className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        ) : null}
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <StatCard
          label="Visible samples"
          value={String(samples.length)}
          note="Only the records allowed by the signed-in role are counted here."
        />
        <StatCard
          label="In progress"
          value={String(statusCounts.received + statusCounts.in_testing + statusCounts.qc_review)}
          note="Samples still moving through the lab process."
        />
        <StatCard
          label="Ready or done"
          value={String(statusCounts.approved + statusCounts.completed)}
          note="Samples already approved or fully completed."
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <DataTable
          title="Samples List"
          description="This table shows sample id, client, test type, current status, and creation date."
          columns={["Sample ID", "Sample Name", "Client", "Test Type", "Status", "Created Date"]}
          rows={rows}
        />

        <Card className="border-white/70 bg-white/85">
          <CardHeader>
            <CardTitle>How this view changes by role</CardTitle>
            <CardDescription>Plain-English rule summary for the founder.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-6 text-[#55797c]">
            <div className="rounded-2xl bg-[#e8f5f3] p-4">
              <div className="flex items-center gap-3">
                <FlaskConical className="h-5 w-5 text-[#145761]" />
                <p className="font-medium text-[#12343b]">Lab manager</p>
              </div>
              <p className="mt-2">Can create samples, update status, and open every sample detail page.</p>
            </div>
            <div className="rounded-2xl bg-[#e8f5f3] p-4">
              <div className="flex items-center gap-3">
                <TestTube2 className="h-5 w-5 text-[#145761]" />
                <p className="font-medium text-[#12343b]">Scientist</p>
              </div>
              <p className="mt-2">Only sees samples assigned to their scientist profile.</p>
            </div>
            <div className="rounded-2xl bg-[#e8f5f3] p-4">
              <div className="flex items-center gap-3">
                <ArrowRight className="h-5 w-5 text-[#145761]" />
                <p className="font-medium text-[#12343b]">Client</p>
              </div>
              <p className="mt-2">Only sees their own samples and cannot change any record.</p>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
