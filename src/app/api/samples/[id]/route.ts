import { NextResponse } from "next/server";

import { getApiSessionProfile } from "@/lib/auth";
import { getRecordById, sampleStatuses, updateRecord } from "@/lib/samples";
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
  const [{ data: sample, error }, { data: activities }] = await Promise.all([
    getRecordById(supabase, params.id, session.profile),
    supabase
      .from("sample_activities")
      .select("id, action, detail, status, created_at, created_by")
      .eq("sample_id", params.id)
      .order("created_at", { ascending: false })
  ]);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  if (!sample) {
    return NextResponse.json({ error: "Sample not found." }, { status: 404 });
  }

  return NextResponse.json({ data: { ...sample, activities: activities ?? [] } });
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getApiSessionProfile();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.profile.role !== "lab_manager") {
    return NextResponse.json(
      { error: "Only the lab manager can update sample status." },
      { status: 403 }
    );
  }

  const body = await request.json();

  if (body.status && !sampleStatuses.includes(body.status)) {
    return NextResponse.json({ error: "Invalid sample status." }, { status: 400 });
  }

  const supabase = createSupabaseServerClient();
  const existing = await getRecordById(supabase, params.id, session.profile);

  if (!existing.data) {
    return NextResponse.json({ error: "Sample not found." }, { status: 404 });
  }

  if (
    body.status === "disposed" &&
    (!body.disposalReason || typeof body.disposalReason !== "string" || !body.disposalReason.trim())
  ) {
    return NextResponse.json(
      { error: "Disposal reason is required when the sample is disposed." },
      { status: 400 }
    );
  }

  const { data, error } = await updateRecord(supabase, params.id, {
    status: body.status,
    assignedScientistId: body.assignedScientistId ?? undefined,
    currentLocation: body.currentLocation ?? undefined,
    disposalReason: body.disposalReason ?? undefined,
    disposedBy: session.profile.id
  });

  if (error || !data) {
    return NextResponse.json({ error: error?.message ?? "Sample update failed." }, { status: 400 });
  }

  const activityParts = [];

  if (body.status && body.status !== existing.data.status) {
    activityParts.push(`Status changed from ${existing.data.status} to ${body.status}.`);
  }

  if (
    Object.prototype.hasOwnProperty.call(body, "currentLocation") &&
    body.currentLocation !== existing.data.current_location
  ) {
    activityParts.push(`Location changed to ${body.currentLocation || "not specified"}.`);
  }

  if (Object.prototype.hasOwnProperty.call(body, "assignedScientistId")) {
    activityParts.push("Scientist assignment was updated.");
  }

  if (body.status === "disposed") {
    activityParts.push(`Disposal reason recorded: ${body.disposalReason}.`);
  }

  if (activityParts.length > 0) {
    await supabase.from("sample_activities").insert({
      sample_id: data.id,
      action: "Sample updated",
      detail: activityParts.join(" "),
      status: data.status,
      created_by: session.profile.id
    });
  }

  return NextResponse.json({ data });
}
