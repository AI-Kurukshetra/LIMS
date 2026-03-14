import { NextResponse } from "next/server";

import { getApiSessionProfile } from "@/lib/auth";
import {
  addSampleCustodyEvent,
  createRecord,
  getRecords,
  samplePriorities
} from "@/lib/samples";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET() {
  const session = await getApiSessionProfile();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!["lab_manager", "scientist", "client"].includes(session.profile.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const supabase = createSupabaseServerClient();
  const { data, error } = await getRecords(supabase, session.profile);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ data });
}

export async function POST(request: Request) {
  const session = await getApiSessionProfile();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.profile.role !== "lab_manager") {
    return NextResponse.json({ error: "Only lab managers can create samples." }, { status: 403 });
  }

  const body = await request.json();

  if (
    !body.sampleName ||
    !body.sampleType ||
    !body.clientId ||
    !body.testType ||
    !body.priority ||
    !body.receivedAt
  ) {
    return NextResponse.json(
      {
        error:
          "Sample name, sample type, client, test type, priority, and received date are required."
      },
      { status: 400 }
    );
  }

  if (!samplePriorities.includes(body.priority)) {
    return NextResponse.json({ error: "Invalid sample priority." }, { status: 400 });
  }

  const receivedAt = new Date(body.receivedAt);

  if (Number.isNaN(receivedAt.getTime())) {
    return NextResponse.json({ error: "Invalid received date and time." }, { status: 400 });
  }

  const supabase = createSupabaseServerClient();
  const { data, error } = await createRecord(supabase, {
    sampleName: body.sampleName,
    sampleType: body.sampleType,
    clientId: body.clientId,
    testType: body.testType,
    priority: body.priority,
    receivedAt: receivedAt.toISOString(),
    barcodeValue: body.barcodeValue ?? null,
    sourceLabel: body.sourceLabel ?? null,
    currentLocation: body.currentLocation ?? null,
    assignedScientistId: body.assignedScientistId ?? null,
    createdBy: session.profile.id
  });

  if (error || !data) {
    return NextResponse.json({ error: error?.message ?? "Sample creation failed." }, { status: 400 });
  }

  await supabase.from("sample_activities").insert({
    sample_id: data.id,
    action: "Sample created",
    detail: `Sample ${data.accession_number} created by ${session.profile.full_name || session.profile.email}.`,
    status: data.status,
    created_by: session.profile.id
  });

  await addSampleCustodyEvent(supabase, {
    sampleId: data.id,
    eventType: "received",
    location: data.current_location,
    notes: "Sample received and registered in the system.",
    createdBy: session.profile.id
  });

  return NextResponse.json({ data }, { status: 201 });
}
