import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, ClipboardList, History, MessageSquareMore, PackageSearch, UserRound } from "lucide-react";

import { SampleCustodyForm } from "@/components/samples/sample-custody-form";
import { SampleReviewForm } from "@/components/samples/sample-review-form";
import { SampleReviewStatusBadge } from "@/components/samples/sample-review-status-badge";
import { SampleStatusForm } from "@/components/samples/sample-status-form";
import { SampleStatusBadge } from "@/components/samples/sample-status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { requireUserProfile } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  getSampleCustodyEventLabel,
  getSampleCustodyEvents,
  getRecordById,
  getSampleActivities,
  getSampleFormOptions,
  getSamplePriorityLabel,
  getSampleReviews,
  getSampleProgressSteps
} from "@/lib/samples";

export default async function SampleDetailsPage({
  params
}: {
  params: { id: string };
}) {
  const { profile } = await requireUserProfile(["lab_manager", "scientist", "client"]);
  const supabase = createSupabaseServerClient();
  const [{ data: sample }, { data: activities }, { data: custodyEvents }, { data: reviews }, formOptions] = await Promise.all([
    getRecordById(supabase, params.id, profile),
    getSampleActivities(supabase, params.id),
    getSampleCustodyEvents(supabase, params.id),
    getSampleReviews(supabase, params.id),
    profile.role === "lab_manager"
      ? getSampleFormOptions(supabase)
      : Promise.resolve({ clients: [], scientists: [], staff: [], error: null })
  ]);

  if (!sample) {
    notFound();
  }

  const progressSteps = getSampleProgressSteps(sample.status);
  const latestReview = reviews[0] ?? null;

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-soft">
        <div className="mb-4">
          <Button asChild variant="outline" size="sm">
            <Link href="/samples">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to samples
            </Link>
          </Button>
        </div>
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <Badge variant="secondary" className="border-0 bg-[#edf7f5] text-[#145761]">
              Sample Details
            </Badge>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[#12343b]">
              {sample.sample_name}
            </h1>
            <p className="mt-3 text-sm font-medium uppercase tracking-[0.24em] text-[#4f7a7f]">
              {sample.accession_number}
            </p>
            <p className="mt-2 text-sm leading-6 text-[#55797c]">
              Track the sample record, location, custody movement, and activity history in one place.
            </p>
          </div>
          <SampleStatusBadge status={sample.status} />
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="border-white/70 bg-white/85">
          <CardHeader>
            <CardTitle>Tracking Summary</CardTitle>
            <CardDescription>Plain-English details that help staff identify and follow the sample.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            {[
              ["Sample Number", sample.accession_number],
              ["Sample Name", sample.sample_name],
              ["Sample Type", sample.sample_type],
              ["Priority", getSamplePriorityLabel(sample.priority)],
              ["Client", sample.client?.full_name ?? "Unknown client"],
              ["Test Type", sample.test_type],
              ["Source", sample.source_label ?? "Not recorded"],
              ["Barcode", sample.barcode_value ?? "Not recorded"],
              ["Current Location", sample.current_location ?? "Not recorded"],
              ["Assigned Scientist", sample.assigned_scientist?.full_name ?? "Not assigned"],
              ["Created By", sample.creator?.full_name ?? "Unknown creator"],
              ["Received At", new Date(sample.received_at).toLocaleString()],
              ["Created At", new Date(sample.created_at).toLocaleString()],
              [
                "Latest Review",
                latestReview
                  ? `${latestReview.reviewer?.full_name ?? "Scientist"} - ${latestReview.feedback}`
                  : "No scientist review yet"
              ],
              [
                "Disposed",
                sample.disposed_at
                  ? `${new Date(sample.disposed_at).toLocaleString()} by ${sample.disposer?.full_name ?? "Unknown user"}`
                  : "No"
              ],
              ["Disposal Reason", sample.disposal_reason ?? "Not applicable"]
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
          <div className="space-y-6">
            <SampleStatusForm
              sampleId={sample.id}
              currentStatus={sample.status}
              currentLocation={sample.current_location}
              disposalReason={sample.disposal_reason}
              currentScientistId={sample.assigned_scientist_id}
              scientists={formOptions.scientists}
            />
            <SampleCustodyForm
              sampleId={sample.id}
              currentLocation={sample.current_location}
              staff={formOptions.staff}
            />
          </div>
        ) : profile.role === "scientist" ? (
          <div className="space-y-6">
            <SampleReviewForm sampleId={sample.id} />
            <Card className="border-white/70 bg-white/85">
              <CardHeader>
                <CardTitle>Your Access</CardTitle>
                <CardDescription>
                  You can review this sample because it is assigned to your scientist account.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-sm leading-6 text-[#55797c]">
                <div className="rounded-2xl bg-[#e8f5f3] p-4">
                  <div className="flex items-center gap-3">
                    <UserRound className="h-5 w-5 text-[#145761]" />
                    <p className="font-medium text-[#12343b]">Assigned reviewer</p>
                  </div>
                  <p className="mt-2">You can add review feedback for this sample and the client can read it later.</p>
                </div>
              </CardContent>
            </Card>
          </div>
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
                <p className="mt-2">This sample belongs to the signed-in client profile.</p>
              </div>
              <div className="rounded-2xl bg-[#e8f5f3] p-4">
                <div className="flex items-center gap-3">
                  <ClipboardList className="h-5 w-5 text-[#145761]" />
                  <p className="font-medium text-[#12343b]">Edit rights</p>
                </div>
                <p className="mt-2">Clients can view current status and scientist feedback, but cannot edit anything.</p>
              </div>
            </CardContent>
          </Card>
        )}
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
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

        <div className="space-y-6">
          <Card className="border-white/70 bg-white/85">
            <CardHeader>
              <CardTitle>Scientist Feedback</CardTitle>
              <CardDescription>
                Review comments and decisions added by the assigned scientist.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {reviews.length === 0 ? (
                <div className="rounded-2xl bg-[#f8fcfb] p-4 text-sm text-[#55797c]">
                  No scientist review has been recorded yet for this sample.
                </div>
              ) : (
                reviews.map((review) => (
                  <div key={review.id} className="rounded-2xl border border-border/70 bg-[#f8fcfb] p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-3">
                          <p className="font-semibold text-[#12343b]">
                            {review.reviewer?.full_name ?? "Scientist review"}
                          </p>
                          <SampleReviewStatusBadge status={review.review_status} />
                        </div>
                        <p className="mt-2 text-sm leading-6 text-[#55797c]">{review.feedback}</p>
                      </div>
                      <p className="text-xs uppercase tracking-[0.2em] text-[#6b8f92]">
                        <MessageSquareMore className="mr-1 inline h-3 w-3" />
                        {new Date(review.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card className="border-white/70 bg-white/85">
            <CardHeader>
              <CardTitle>Chain Of Custody</CardTitle>
              <CardDescription>
                Shows who received the sample, where it moved, and who took responsibility next.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {custodyEvents.length === 0 ? (
                <div className="rounded-2xl bg-[#f8fcfb] p-4 text-sm text-[#55797c]">
                  No custody movement has been recorded yet for this sample.
                </div>
              ) : (
                custodyEvents.map((event) => (
                  <div key={event.id} className="rounded-2xl border border-border/70 bg-[#f8fcfb] p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-semibold text-[#12343b]">
                          {getSampleCustodyEventLabel(event.event_type)}
                        </p>
                        <p className="mt-1 text-sm leading-6 text-[#55797c]">
                          {event.to_profile?.full_name
                            ? `Handled by ${event.to_profile.full_name}. `
                            : ""}
                          {event.location ? `Location: ${event.location}. ` : ""}
                          {event.notes || "No extra note was added."}
                        </p>
                      </div>
                      <p className="text-xs uppercase tracking-[0.2em] text-[#6b8f92]">
                        <PackageSearch className="mr-1 inline h-3 w-3" />
                        {new Date(event.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
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
        </div>
      </section>
    </div>
  );
}
