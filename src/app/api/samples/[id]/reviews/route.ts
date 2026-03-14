import { NextResponse } from "next/server";

import { getApiSessionProfile } from "@/lib/auth";
import {
  addSampleActivity,
  addSampleReview,
  getRecordById,
  getSampleReviews,
  sampleReviewStatuses
} from "@/lib/samples";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getApiSessionProfile();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createSupabaseServerClient();
  const sample = await getRecordById(supabase, params.id, session.profile);

  if (!sample.data) {
    return NextResponse.json({ error: "Sample not found." }, { status: 404 });
  }

  const { data, error } = await getSampleReviews(supabase, params.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ data });
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getApiSessionProfile();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.profile.role !== "scientist") {
    return NextResponse.json(
      { error: "Only the assigned scientist can submit review feedback." },
      { status: 403 }
    );
  }

  const body = await request.json();

  if (!body.reviewStatus || !sampleReviewStatuses.includes(body.reviewStatus)) {
    return NextResponse.json({ error: "Invalid review status." }, { status: 400 });
  }

  if (!body.feedback || typeof body.feedback !== "string" || !body.feedback.trim()) {
    return NextResponse.json({ error: "Review feedback is required." }, { status: 400 });
  }

  const supabase = createSupabaseServerClient();
  const sample = await getRecordById(supabase, params.id, session.profile);

  if (!sample.data) {
    return NextResponse.json({ error: "Sample not found." }, { status: 404 });
  }

  if (sample.data.assigned_scientist_id !== session.profile.id) {
    return NextResponse.json(
      { error: "This sample is not assigned to the signed-in scientist." },
      { status: 403 }
    );
  }

  const { data, error } = await addSampleReview(supabase, {
    sampleId: params.id,
    reviewStatus: body.reviewStatus,
    feedback: body.feedback,
    reviewerId: session.profile.id
  });

  if (error || !data) {
    return NextResponse.json({ error: error?.message ?? "Review could not be saved." }, { status: 400 });
  }

  await addSampleActivity(supabase, {
    sampleId: params.id,
    action: "Scientist review submitted",
    detail: `${session.profile.full_name || session.profile.email} marked the sample as ${body.reviewStatus} and added review feedback.`,
    status: sample.data.status,
    createdBy: session.profile.id
  });

  return NextResponse.json({ data }, { status: 201 });
}
