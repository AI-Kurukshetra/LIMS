import { NextResponse } from "next/server";

import { getApiSessionProfile } from "@/lib/auth";
import {
  addSampleActivity,
  addSampleCustodyEvent,
  getRecordById,
  sampleCustodyEventTypes,
  updateRecord
} from "@/lib/samples";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getApiSessionProfile();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.profile.role !== "lab_manager") {
    return NextResponse.json(
      { error: "Only the lab manager can log sample movements." },
      { status: 403 }
    );
  }

  const body = await request.json();

  if (!body.eventType || !sampleCustodyEventTypes.includes(body.eventType)) {
    return NextResponse.json({ error: "Invalid movement type." }, { status: 400 });
  }

  if (body.eventType === "handoff" && !body.toProfileId) {
    return NextResponse.json(
      { error: "Please choose the staff member who received the sample." },
      { status: 400 }
    );
  }

  const supabase = createSupabaseServerClient();
  const existing = await getRecordById(supabase, params.id, session.profile);

  if (!existing.data) {
    return NextResponse.json({ error: "Sample not found." }, { status: 404 });
  }

  const custodyResult = await addSampleCustodyEvent(supabase, {
    sampleId: params.id,
    eventType: body.eventType,
    fromProfileId: existing.data.assigned_scientist_id,
    toProfileId: body.toProfileId ?? null,
    location: body.location ?? null,
    notes: body.notes ?? null,
    createdBy: session.profile.id
  });

  if (custodyResult.error || !custodyResult.data) {
    return NextResponse.json(
      { error: custodyResult.error?.message ?? "Movement could not be recorded." },
      { status: 400 }
    );
  }

  const shouldUpdateAssignment = body.eventType === "handoff";
  const shouldUpdateLocation = Object.prototype.hasOwnProperty.call(body, "location");

  if (shouldUpdateAssignment || shouldUpdateLocation) {
    await updateRecord(supabase, params.id, {
      assignedScientistId: shouldUpdateAssignment ? body.toProfileId ?? null : undefined,
      currentLocation: shouldUpdateLocation ? body.location ?? null : undefined
    });
  }

  const detailParts = [];

  if (body.eventType === "handoff") {
    detailParts.push("Custody handoff recorded.");
  } else if (body.eventType === "received") {
    detailParts.push("Sample receipt recorded.");
  } else {
    detailParts.push("Storage location updated.");
  }

  if (body.location) {
    detailParts.push(`Location: ${body.location}.`);
  }

  if (body.notes) {
    detailParts.push(body.notes);
  }

  await addSampleActivity(supabase, {
    sampleId: params.id,
    action: "Sample movement logged",
    detail: detailParts.join(" "),
    status: existing.data.status,
    createdBy: session.profile.id
  });

  return NextResponse.json({ data: custodyResult.data }, { status: 201 });
}
