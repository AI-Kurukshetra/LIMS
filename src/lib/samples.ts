import type { SupabaseClient } from "@supabase/supabase-js";

import type { AppRole } from "@/lib/rbac";

export const sampleStatuses = [
  "received",
  "in_testing",
  "qc_review",
  "approved",
  "completed"
] as const;

export type SampleStatus = (typeof sampleStatuses)[number];

export type SampleFormOption = {
  id: string;
  full_name: string;
};

export type SampleSummary = {
  id: string;
  sample_name: string;
  sample_type: string;
  test_type: string;
  status: SampleStatus;
  created_at: string;
  client_id: string;
  assigned_scientist_id: string | null;
  created_by: string;
  client: { id: string; full_name: string } | null;
  assigned_scientist: { id: string; full_name: string } | null;
  creator: { id: string; full_name: string } | null;
};

export type SampleActivity = {
  id: string;
  action: string;
  detail: string;
  status: SampleStatus | null;
  created_at: string;
  created_by: string | null;
};

export type SampleDetails = SampleSummary & {
  activities: SampleActivity[];
};

export type SampleCreateInput = {
  sampleName: string;
  sampleType: string;
  clientId: string;
  testType: string;
  assignedScientistId?: string | null;
};

export type SampleUpdateInput = {
  status?: SampleStatus;
  assignedScientistId?: string | null;
};

type ViewerProfile = {
  id: string;
  role: AppRole;
  full_name: string;
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
    sample_name: record.sample_name,
    sample_type: record.sample_type,
    test_type: record.test_type,
    status: record.status,
    created_at: record.created_at,
    client_id: record.client_id,
    assigned_scientist_id: record.assigned_scientist_id,
    created_by: record.created_by,
    client: Array.isArray(record.client) ? record.client[0] ?? null : record.client ?? null,
    assigned_scientist: Array.isArray(record.assigned_scientist)
      ? record.assigned_scientist[0] ?? null
      : record.assigned_scientist ?? null,
    creator: Array.isArray(record.creator) ? record.creator[0] ?? null : record.creator ?? null
  };
}

const sampleSelect = `
  id,
  sample_name,
  sample_type,
  test_type,
  status,
  created_at,
  client_id,
  assigned_scientist_id,
  created_by,
  client:profiles!samples_client_id_fkey(id, full_name),
  assigned_scientist:profiles!samples_assigned_scientist_id_fkey(id, full_name),
  creator:profiles!samples_created_by_fkey(id, full_name)
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
  input: SampleUpdateInput
) {
  const updatePayload: Record<string, string | null> = {};

  if (input.status) {
    updatePayload.status = input.status;
  }

  if (Object.prototype.hasOwnProperty.call(input, "assignedScientistId")) {
    updatePayload.assigned_scientist_id = input.assignedScientistId ?? null;
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

// The create-sample page needs dropdown options for clients and scientists.
export async function getSampleFormOptions(supabase: SupabaseClient) {
  const [{ data: clients, error: clientError }, { data: scientists, error: scientistError }] =
    await Promise.all([
      supabase
        .from("profiles")
        .select("id, full_name")
        .eq("role", "client")
        .order("full_name", { ascending: true }),
      supabase
        .from("profiles")
        .select("id, full_name")
        .eq("role", "scientist")
        .order("full_name", { ascending: true })
    ]);

  return {
    clients: (clients ?? []) as SampleFormOption[],
    scientists: (scientists ?? []) as SampleFormOption[],
    error: clientError ?? scientistError ?? null
  };
}

export function getSampleStatusLabel(status: SampleStatus) {
  return status
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function getSampleProgressSteps(currentStatus: SampleStatus) {
  const orderedStatuses: SampleStatus[] = [
    "received",
    "in_testing",
    "qc_review",
    "approved",
    "completed"
  ];

  const currentIndex = orderedStatuses.indexOf(currentStatus);

  return orderedStatuses.map((status, index) => ({
    key: status,
    label: getSampleStatusLabel(status),
    done: index <= currentIndex
  }));
}
