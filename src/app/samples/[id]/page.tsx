import { notFound } from "next/navigation";
import { ClipboardList, History, UserRound } from "lucide-react";

import { SampleStatusForm } from "@/components/samples/sample-status-form";
import { SampleStatusBadge } from "@/components/samples/sample-status-badge";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { requireUserProfile } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  getRecordById,
  getSampleActivities,
  getSampleFormOptions,
  getSampleProgressSteps
} from "@/lib/samples";

export default async function SampleDetailsPage({
  params
}: {
  params: { id: string };
}) {
  const { profile } = await requireUserProfile(["lab_manager", "scientist", "client"]);
  const supabase = createSupabaseServerClient();
  const [{ data: sample }, { data: activities }, scientistOptions] = await Promise.all([
    getRecordById(supabase, params.id, profile),
    getSampleActivities(supabase, params.id),
    profile.role === "lab_manager"
      ? getSampleFormOptions(supabase)
      : Promise.resolve({ clients: [], scientists: [], error: null })
  ]);

  if (!sample) {
    notFound();
  }

  const progressSteps = getSampleProgressSteps(sample.status);

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-soft">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <Badge variant="secondary" className="border-0 bg-[#edf7f5] text-[#145761]">
              Sample Details
            </Badge>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[#12343b]">
              {sample.sample_name}
            </h1>
            <p className="mt-2 text-sm leading-6 text-[#55797c]">
              Track the sample record, workflow progress, and activity history in one place.
            </p>
          </div>
          <SampleStatusBadge status={sample.status} />
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="border-white/70 bg-white/85">
          <CardHeader>
            <CardTitle>Sample Information</CardTitle>
            <CardDescription>Core sample fields from the database.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            {[
              ["Sample ID", sample.id],
              ["Sample Name", sample.sample_name],
              ["Sample Type", sample.sample_type],
              ["Client", sample.client?.full_name ?? "Unknown client"],
              ["Test Type", sample.test_type],
              ["Assigned Scientist", sample.assigned_scientist?.full_name ?? "Not assigned"],
              ["Created By", sample.creator?.full_name ?? "Unknown creator"],
              ["Created At", new Date(sample.created_at).toLocaleString()]
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl bg-[#f8fcfb] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6b8f92]">
                  {label}
                </p>
                <p className="mt-2 text-sm leading-6 text-[#12343b]">{value}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {profile.role === "lab_manager" ? (
          <SampleStatusForm
            sampleId={sample.id}
            currentStatus={sample.status}
            currentScientistId={sample.assigned_scientist_id}
            scientists={scientistOptions.scientists}
          />
        ) : (
          <Card className="border-white/70 bg-white/85">
            <CardHeader>
              <CardTitle>Role Access</CardTitle>
              <CardDescription>Why this sample is visible to the current user.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm leading-6 text-[#55797c]">
              <div className="rounded-2xl bg-[#e8f5f3] p-4">
                <div className="flex items-center gap-3">
                  <UserRound className="h-5 w-5 text-[#145761]" />
                  <p className="font-medium text-[#12343b]">Current role</p>
                </div>
                <p className="mt-2">
                  {profile.role === "scientist"
                    ? "This sample is assigned to the signed-in scientist profile."
                    : "This sample belongs to the signed-in client profile."}
                </p>
              </div>
              <div className="rounded-2xl bg-[#e8f5f3] p-4">
                <div className="flex items-center gap-3">
                  <ClipboardList className="h-5 w-5 text-[#145761]" />
                  <p className="font-medium text-[#12343b]">Edit rights</p>
                </div>
                <p className="mt-2">Only the lab manager can update status or assignment in this module.</p>
              </div>
            </CardContent>
          </Card>
        )}
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card className="border-white/70 bg-white/85">
          <CardHeader>
            <CardTitle>Test Progress</CardTitle>
            <CardDescription>
              Founder-friendly step view based on the current sample status.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {progressSteps.map((step, index) => (
              <div key={step.key} className="flex items-start gap-4">
                <div
                  className={`mt-1 flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                    step.done
                      ? "bg-[#12353d] text-white"
                      : "border border-border bg-white text-[#6b8f92]"
                  }`}
                >
                  {index + 1}
                </div>
                <div>
                  <p className="font-medium text-[#12343b]">{step.label}</p>
                  <p className="text-sm text-[#55797c]">
                    {step.done ? "Completed or currently active." : "This step has not been reached yet."}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-white/70 bg-white/85">
          <CardHeader>
            <CardTitle>Activity History</CardTitle>
            <CardDescription>
              A simple timeline of actions recorded for this sample.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {activities.length === 0 ? (
              <div className="rounded-2xl bg-[#f8fcfb] p-4 text-sm text-[#55797c]">
                No activity has been recorded yet for this sample.
              </div>
            ) : (
              activities.map((activity) => (
                <div key={activity.id} className="rounded-2xl border border-border/70 bg-[#f8fcfb] p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold text-[#12343b]">{activity.action}</p>
                      <p className="mt-1 text-sm leading-6 text-[#55797c]">{activity.detail}</p>
                    </div>
                    <div className="text-right">
                      {activity.status ? <SampleStatusBadge status={activity.status} /> : null}
                      <p className="mt-2 text-xs uppercase tracking-[0.2em] text-[#6b8f92]">
                        <History className="mr-1 inline h-3 w-3" />
                        {new Date(activity.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
