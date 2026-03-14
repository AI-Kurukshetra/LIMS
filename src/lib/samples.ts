import type { SupabaseClient } from "@supabase/supabase-js";

import type { AppRole } from "@/lib/rbac";

export const sampleStatuses = [
  "received",
  "in_testing",
  "qc_review",
  "approved",
  "completed",
  "disposed"
] as const;

export type SampleStatus = (typeof sampleStatuses)[number];

export const samplePriorities = ["routine", "urgent", "stat"] as const;

export type SamplePriority = (typeof samplePriorities)[number];

export const sampleCustodyEventTypes = [
  "received",
  "handoff",
  "storage_update"
] as const;

export type SampleCustodyEventType = (typeof sampleCustodyEventTypes)[number];

export const sampleReviewStatuses = [
  "reviewed",
  "needs_changes",
  "approved"
] as const;

export type SampleReviewStatus = (typeof sampleReviewStatuses)[number];

export type SampleFormOption = {
  id: string;
  full_name: string;
};

type SampleProfileLink = { id: string; full_name: string } | null;

export type SampleSummary = {
  id: string;
  accession_number: string;
  sample_name: string;
  sample_type: string;
  test_type: string;
  status: SampleStatus;
  priority: SamplePriority;
  created_at: string;
  received_at: string;
  client_id: string;
  assigned_scientist_id: string | null;
  created_by: string;
  disposed_by: string | null;
  barcode_value: string | null;
  source_label: string | null;
  current_location: string | null;
  disposed_at: string | null;
  disposal_reason: string | null;
  client: SampleProfileLink;
  assigned_scientist: SampleProfileLink;
  creator: SampleProfileLink;
  disposer: SampleProfileLink;
};

export type SampleActivity = {
  id: string;
  action: string;
  detail: string;
  status: SampleStatus | null;
  created_at: string;
  created_by: string | null;
};

export type SampleCustodyEvent = {
  id: string;
  event_type: SampleCustodyEventType;
  location: string | null;
  notes: string;
  created_at: string;
  created_by: string | null;
  from_profile: SampleProfileLink;
  to_profile: SampleProfileLink;
};

export type SampleReview = {
  id: string;
  review_status: SampleReviewStatus;
  feedback: string;
  created_at: string;
  reviewer_id: string;
  reviewer: SampleProfileLink;
};

export type SampleDetails = SampleSummary & {
  activities: SampleActivity[];
  custodyEvents: SampleCustodyEvent[];
  reviews: SampleReview[];
};

export type SampleCreateInput = {
  sampleName: string;
  sampleType: string;
  clientId: string;
  testType: string;
  priority: SamplePriority;
  receivedAt: string;
  barcodeValue?: string | null;
  sourceLabel?: string | null;
  currentLocation?: string | null;
  assignedScientistId?: string | null;
};

export type SampleUpdateInput = {
  status?: SampleStatus;
  assignedScientistId?: string | null;
  currentLocation?: string | null;
  disposalReason?: string | null;
};

export type SampleCustodyEventInput = {
  sampleId: string;
  eventType: SampleCustodyEventType;
  fromProfileId?: string | null;
  toProfileId?: string | null;
  location?: string | null;
  notes?: string | null;
  createdBy: string;
};

export type SampleReviewInput = {
  sampleId: string;
  reviewStatus: SampleReviewStatus;
  feedback: string;
  reviewerId: string;
};

type ViewerProfile = {
  id: string;
  role: AppRole;
  full_name: string;
};

type SampleQueryOptions = {
  searchTerm?: string;
  limit?: number;
};

function applySampleVisibilityFilter(
  query: any,
  viewer: ViewerProfile
) {
  if (viewer.role === "lab_manager" || viewer.role === "admin") {
    return query;
  }

  if (viewer.role === "scientist") {
    return query.eq("assigned_scientist_id", viewer.id);
  }

  return query.eq("client_id", viewer.id);
}

function normalizeSampleRecord(record: any): SampleSummary {
  return {
    id: record.id,
    accession_number: record.accession_number,
    sample_name: record.sample_name,
    sample_type: record.sample_type,
    test_type: record.test_type,
    status: record.status,
    priority: record.priority,
    created_at: record.created_at,
    received_at: record.received_at,
    client_id: record.client_id,
    assigned_scientist_id: record.assigned_scientist_id,
    created_by: record.created_by,
    disposed_by: record.disposed_by,
    barcode_value: record.barcode_value,
    source_label: record.source_label,
    current_location: record.current_location,
    disposed_at: record.disposed_at,
    disposal_reason: record.disposal_reason,
    client: Array.isArray(record.client) ? record.client[0] ?? null : record.client ?? null,
    assigned_scientist: Array.isArray(record.assigned_scientist)
      ? record.assigned_scientist[0] ?? null
      : record.assigned_scientist ?? null,
    creator: Array.isArray(record.creator) ? record.creator[0] ?? null : record.creator ?? null,
    disposer: Array.isArray(record.disposer) ? record.disposer[0] ?? null : record.disposer ?? null
  };
}

function normalizeCustodyEventRecord(record: any): SampleCustodyEvent {
  return {
    id: record.id,
    event_type: record.event_type,
    location: record.location,
    notes: record.notes ?? "",
    created_at: record.created_at,
    created_by: record.created_by,
    from_profile: Array.isArray(record.from_profile)
      ? record.from_profile[0] ?? null
      : record.from_profile ?? null,
    to_profile: Array.isArray(record.to_profile)
      ? record.to_profile[0] ?? null
      : record.to_profile ?? null
  };
}

function normalizeSampleReviewRecord(record: any): SampleReview {
  return {
    id: record.id,
    review_status: record.review_status,
    feedback: record.feedback,
    created_at: record.created_at,
    reviewer_id: record.reviewer_id,
    reviewer: Array.isArray(record.reviewer) ? record.reviewer[0] ?? null : record.reviewer ?? null
  };
}

const sampleSelect = `
  id,
  accession_number,
  sample_name,
  sample_type,
  test_type,
  status,
  priority,
  created_at,
  received_at,
  client_id,
  assigned_scientist_id,
  created_by,
  disposed_by,
  barcode_value,
  source_label,
  current_location,
  disposed_at,
  disposal_reason,
  client:profiles!samples_client_id_fkey(id, full_name),
  assigned_scientist:profiles!samples_assigned_scientist_id_fkey(id, full_name),
  creator:profiles!samples_created_by_fkey(id, full_name),
  disposer:profiles!samples_disposed_by_fkey(id, full_name)
`;

const custodyEventSelect = `
  id,
  event_type,
  location,
  notes,
  created_at,
  created_by,
  from_profile:profiles!sample_custody_events_from_profile_id_fkey(id, full_name),
  to_profile:profiles!sample_custody_events_to_profile_id_fkey(id, full_name)
`;

const sampleReviewSelect = `
  id,
  review_status,
  feedback,
  created_at,
  reviewer_id,
  reviewer:profiles!sample_reviews_reviewer_id_fkey(id, full_name)
`;

// Create a sample row and return the inserted record.
export async function createRecord(
  supabase: SupabaseClient,
  input: SampleCreateInput & { createdBy: string }
) {
  const { data, error } = await supabase
    .from("samples")
    .insert({
      sample_name: input.sampleName,
      sample_type: input.sampleType,
      client_id: input.clientId,
      test_type: input.testType,
      priority: input.priority,
      received_at: input.receivedAt,
      barcode_value: input.barcodeValue ?? null,
      source_label: input.sourceLabel ?? null,
      current_location: input.currentLocation ?? null,
      created_by: input.createdBy,
      assigned_scientist_id: input.assignedScientistId ?? null
    })
    .select(sampleSelect)
    .single();

  if (error) {
    return { data: null, error };
  }

  return { data: normalizeSampleRecord(data), error: null };
}

// Read the samples visible to the current role.
export async function getRecords(supabase: SupabaseClient, viewer: ViewerProfile) {
  const query = supabase.from("samples").select(sampleSelect).order("created_at", { ascending: false });
  const filteredQuery = applySampleVisibilityFilter(query, viewer);
  const { data, error } = await filteredQuery;

  if (error) {
    return { data: [], error };
  }

  return {
    data: (data ?? []).map(normalizeSampleRecord),
    error: null
  };
}

function applySampleSearchFilter(query: any, searchTerm?: string) {
  if (!searchTerm?.trim()) {
    return query;
  }

  const normalizedTerm = searchTerm.trim();
  const escapedTerm = normalizedTerm.replace(/,/g, "\\,");

  return query.or(
    [
      `accession_number.ilike.%${escapedTerm}%`,
      `sample_name.ilike.%${escapedTerm}%`,
      `barcode_value.ilike.%${escapedTerm}%`,
      `test_type.ilike.%${escapedTerm}%`,
      `source_label.ilike.%${escapedTerm}%`,
      `current_location.ilike.%${escapedTerm}%`
    ].join(",")
  );
}

export async function searchRecords(
  supabase: SupabaseClient,
  viewer: ViewerProfile,
  options: SampleQueryOptions
) {
  const query = supabase.from("samples").select(sampleSelect).order("created_at", { ascending: false });
  const visibleQuery = applySampleVisibilityFilter(query, viewer);
  const searchQuery = applySampleSearchFilter(visibleQuery, options.searchTerm);
  const limitedQuery = options.limit ? searchQuery.limit(options.limit) : searchQuery;
  const { data, error } = await limitedQuery;

  if (error) {
    return { data: [], error, exactMatchId: null as string | null };
  }

  const normalizedSearch = options.searchTerm?.trim().toLowerCase() ?? "";
  const records: SampleSummary[] = (data ?? []).map(normalizeSampleRecord);
  const exactMatch =
    records.find((record) => record.accession_number.toLowerCase() === normalizedSearch) ??
    records.find((record) => record.barcode_value?.toLowerCase() === normalizedSearch) ??
    null;

  return {
    data: records,
    error: null,
    exactMatchId: exactMatch?.id ?? null
  };
}

// Read one sample if the current role is allowed to see it.
export async function getRecordById(
  supabase: SupabaseClient,
  sampleId: string,
  viewer: ViewerProfile
) {
  const query = supabase.from("samples").select(sampleSelect).eq("id", sampleId);
  const filteredQuery = applySampleVisibilityFilter(query, viewer);
  const { data, error } = await filteredQuery.maybeSingle();

  if (error) {
    return { data: null, error };
  }

  if (!data) {
    return { data: null, error: null };
  }

  return { data: normalizeSampleRecord(data), error: null };
}

// Update sample status or assignment for the lab manager flow.
export async function updateRecord(
  supabase: SupabaseClient,
  sampleId: string,
  input: SampleUpdateInput & { disposedBy?: string | null }
) {
  const updatePayload: Record<string, string | null> = {};

  if (input.status) {
    updatePayload.status = input.status;
  }

  if (Object.prototype.hasOwnProperty.call(input, "assignedScientistId")) {
    updatePayload.assigned_scientist_id = input.assignedScientistId ?? null;
  }

  if (Object.prototype.hasOwnProperty.call(input, "currentLocation")) {
    updatePayload.current_location = input.currentLocation ?? null;
  }

  if (input.status === "disposed") {
    updatePayload.disposal_reason = input.disposalReason?.trim() ?? null;
    updatePayload.disposed_at = new Date().toISOString();
    updatePayload.disposed_by = input.disposedBy ?? null;
  } else if (input.status) {
    updatePayload.disposal_reason = null;
    updatePayload.disposed_at = null;
    updatePayload.disposed_by = null;
  }

  const { data, error } = await supabase
    .from("samples")
    .update(updatePayload)
    .eq("id", sampleId)
    .select(sampleSelect)
    .single();

  if (error) {
    return { data: null, error };
  }

  return { data: normalizeSampleRecord(data), error: null };
}

// Delete support is included so the module has a complete reusable CRUD surface.
export async function deleteRecord(supabase: SupabaseClient, sampleId: string) {
  const { error } = await supabase.from("samples").delete().eq("id", sampleId);

  return { error };
}

// Insert a readable activity row each time the module performs an important action.
export async function addSampleActivity(
  supabase: SupabaseClient,
  input: {
    sampleId: string;
    action: string;
    detail: string;
    status?: SampleStatus | null;
    createdBy: string;
  }
) {
  const { data, error } = await supabase
    .from("sample_activities")
    .insert({
      sample_id: input.sampleId,
      action: input.action,
      detail: input.detail,
      status: input.status ?? null,
      created_by: input.createdBy
    })
    .select("id, action, detail, status, created_at, created_by")
    .single();

  return { data, error };
}

// Record a chain-of-custody event such as receipt, handoff, or storage movement.
export async function addSampleCustodyEvent(
  supabase: SupabaseClient,
  input: SampleCustodyEventInput
) {
  const { data, error } = await supabase
    .from("sample_custody_events")
    .insert({
      sample_id: input.sampleId,
      event_type: input.eventType,
      from_profile_id: input.fromProfileId ?? null,
      to_profile_id: input.toProfileId ?? null,
      location: input.location ?? null,
      notes: input.notes?.trim() ?? "",
      created_by: input.createdBy
    })
    .select(custodyEventSelect)
    .single();

  if (error) {
    return { data: null, error };
  }

  return { data: normalizeCustodyEventRecord(data), error: null };
}

// Read the activity feed for the sample details page.
export async function getSampleActivities(
  supabase: SupabaseClient,
  sampleId: string
) {
  const { data, error } = await supabase
    .from("sample_activities")
    .select("id, action, detail, status, created_at, created_by")
    .eq("sample_id", sampleId)
    .order("created_at", { ascending: false });

  if (error) {
    return { data: [], error };
  }

  return {
    data: (data ?? []) as SampleActivity[],
    error: null
  };
}

export async function getSampleCustodyEvents(
  supabase: SupabaseClient,
  sampleId: string
) {
  const { data, error } = await supabase
    .from("sample_custody_events")
    .select(custodyEventSelect)
    .eq("sample_id", sampleId)
    .order("created_at", { ascending: false });

  if (error) {
    return { data: [], error };
  }

  return {
    data: (data ?? []).map(normalizeCustodyEventRecord),
    error: null
  };
}

export async function addSampleReview(
  supabase: SupabaseClient,
  input: SampleReviewInput
) {
  const { data, error } = await supabase
    .from("sample_reviews")
    .insert({
      sample_id: input.sampleId,
      review_status: input.reviewStatus,
      feedback: input.feedback.trim(),
      reviewer_id: input.reviewerId
    })
    .select(sampleReviewSelect)
    .single();

  if (error) {
    return { data: null, error };
  }

  return { data: normalizeSampleReviewRecord(data), error: null };
}

export async function getSampleReviews(
  supabase: SupabaseClient,
  sampleId: string
) {
  const { data, error } = await supabase
    .from("sample_reviews")
    .select(sampleReviewSelect)
    .eq("sample_id", sampleId)
    .order("created_at", { ascending: false });

  if (error) {
    return { data: [], error };
  }

  return {
    data: (data ?? []).map(normalizeSampleReviewRecord),
    error: null
  };
}

// The create-sample page needs dropdown options for clients and scientists.
export async function getSampleFormOptions(supabase: SupabaseClient) {
  const [
    { data: clients, error: clientError },
    { data: scientists, error: scientistError },
    { data: staff, error: staffError }
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, full_name")
      .eq("role", "client")
      .order("full_name", { ascending: true }),
    supabase
      .from("profiles")
      .select("id, full_name")
      .eq("role", "scientist")
      .order("full_name", { ascending: true }),
    supabase
      .from("profiles")
      .select("id, full_name")
      .in("role", ["lab_manager", "scientist", "technician", "qc_manager"])
      .order("full_name", { ascending: true })
  ]);

  return {
    clients: (clients ?? []) as SampleFormOption[],
    scientists: (scientists ?? []) as SampleFormOption[],
    staff: (staff ?? []) as SampleFormOption[],
    error: clientError ?? scientistError ?? staffError ?? null
  };
}

export function getSampleStatusLabel(status: SampleStatus) {
  return status
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function getSamplePriorityLabel(priority: SamplePriority) {
  if (priority === "stat") {
    return "STAT";
  }

  return priority.charAt(0).toUpperCase() + priority.slice(1);
}

export function getSampleCustodyEventLabel(eventType: SampleCustodyEventType) {
  switch (eventType) {
    case "received":
      return "Received";
    case "handoff":
      return "Custody handoff";
    case "storage_update":
      return "Storage update";
  }
}

export function getSampleReviewStatusLabel(status: SampleReviewStatus) {
  switch (status) {
    case "reviewed":
      return "Reviewed";
    case "needs_changes":
      return "Needs Changes";
    case "approved":
      return "Approved";
  }
}

export function getSampleProgressSteps(currentStatus: SampleStatus) {
  const orderedStatuses: SampleStatus[] = [
    "received",
    "in_testing",
    "qc_review",
    "approved",
    "completed",
    "disposed"
  ];

  const currentIndex = orderedStatuses.indexOf(currentStatus);

  return orderedStatuses.map((status, index) => ({
    key: status,
    label: getSampleStatusLabel(status),
    done: index <= currentIndex
  }));
}
