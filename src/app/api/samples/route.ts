import { NextResponse } from "next/server";

import { getApiSessionProfile } from "@/lib/auth";
import { createRecord, getRecords } from "@/lib/samples";
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

  if (!body.sampleName || !body.sampleType || !body.clientId || !body.testType) {
    return NextResponse.json(
      { error: "Sample name, sample type, client, and test type are required." },
      { status: 400 }
    );
  }

  const supabase = createSupabaseServerClient();
  const { data, error } = await createRecord(supabase, {
    sampleName: body.sampleName,
    sampleType: body.sampleType,
    clientId: body.clientId,
    testType: body.testType,
    assignedScientistId: body.assignedScientistId ?? null,
    createdBy: session.profile.id
  });

  if (error || !data) {
    return NextResponse.json({ error: error?.message ?? "Sample creation failed." }, { status: 400 });
  }

  await supabase.from("sample_activities").insert({
    sample_id: data.id,
    action: "Sample created",
    detail: `Sample created by ${session.profile.full_name || session.profile.email}.`,
    status: data.status,
    created_by: session.profile.id
  });

  return NextResponse.json({ data }, { status: 201 });
}
