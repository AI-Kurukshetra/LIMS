-- This migration adds the sample management module tables used by the laboratory workflow.
create extension if not exists pgcrypto;

-- These values keep sample progress consistent across the UI and API.
-- Idempotent: re-running the migration must not fail if the enum already exists (42710).
do $$
begin
  create type public.sample_status as enum (
    'received',
    'in_testing',
    'qc_review',
    'approved',
    'completed'
  );
exception
  when duplicate_object then
    null;
end
$$;

-- This helper keeps updated_at current whenever a row changes.
create or replace function public.set_current_timestamp_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$;

-- The samples table stores the core business record for each laboratory sample.
create table if not exists public.samples (
  id uuid primary key default gen_random_uuid(),
  sample_name text not null,
  sample_type text not null,
  client_id uuid not null references public.profiles(id) on delete restrict,
  assigned_scientist_id uuid references public.profiles(id) on delete set null,
  test_type text not null,
  status public.sample_status not null default 'received',
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now()),
  created_by uuid not null references public.profiles(id) on delete restrict
);

comment on table public.samples is 'Main record for a laboratory sample and its current workflow status.';
comment on column public.samples.client_id is 'Client profile linked to the sample.';
comment on column public.samples.assigned_scientist_id is 'Scientist profile assigned to review or work this sample.';

create index if not exists samples_client_id_idx on public.samples (client_id);
create index if not exists samples_assigned_scientist_id_idx on public.samples (assigned_scientist_id);
create index if not exists samples_status_idx on public.samples (status);
create index if not exists samples_created_by_idx on public.samples (created_by);
create index if not exists samples_created_at_idx on public.samples (created_at desc);

drop trigger if exists set_samples_updated_at on public.samples;
create trigger set_samples_updated_at
before update on public.samples
for each row
execute procedure public.set_current_timestamp_updated_at();

-- This table keeps a readable activity timeline for the sample detail page.
create table if not exists public.sample_activities (
  id uuid primary key default gen_random_uuid(),
  sample_id uuid not null references public.samples(id) on delete cascade,
  action text not null,
  detail text not null,
  status public.sample_status,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now()),
  created_by uuid references public.profiles(id) on delete set null
);

comment on table public.sample_activities is 'Activity feed used by the sample details screen.';

create index if not exists sample_activities_sample_id_idx on public.sample_activities (sample_id);
create index if not exists sample_activities_created_at_idx on public.sample_activities (created_at desc);

drop trigger if exists set_sample_activities_updated_at on public.sample_activities;
create trigger set_sample_activities_updated_at
before update on public.sample_activities
for each row
execute procedure public.set_current_timestamp_updated_at();

alter table public.samples enable row level security;
alter table public.sample_activities enable row level security;

-- Avoid RLS recursion: never subquery profiles inside profiles policies. Role checks go through
-- SECURITY DEFINER so the lookup does not re-enter broad profiles policies.
-- VOLATILE required: SET LOCAL is not allowed in STABLE/IMMUTABLE functions.
create or replace function public.current_profile_role()
returns public.app_role
language plpgsql
volatile
security definer
set search_path = public
as $$
declare
  result public.app_role;
begin
  set local row_security = off;
  select p.role into result
  from public.profiles as p
  where p.id = auth.uid()
  limit 1;
  return result;
end;
$$;

revoke all on function public.current_profile_role() from public;
grant execute on function public.current_profile_role() to authenticated;
grant execute on function public.current_profile_role() to service_role;

-- Lab staff need a directory view so they can choose clients and assigned scientists in the UI.
drop policy if exists "Lab staff can read all profiles" on public.profiles;
create policy "Lab staff can read all profiles"
on public.profiles
for select
to authenticated
using (public.current_profile_role() in ('admin', 'lab_manager', 'scientist'));

-- Lab managers can create and manage any sample.
drop policy if exists "Lab managers can insert samples" on public.samples;
create policy "Lab managers can insert samples"
on public.samples
for insert
to authenticated
with check (
  created_by = auth.uid()
  and public.current_profile_role() in ('admin', 'lab_manager')
);

drop policy if exists "Visible users can read samples" on public.samples;
create policy "Visible users can read samples"
on public.samples
for select
to authenticated
using (
  public.current_profile_role() in ('admin', 'lab_manager')
  or (
    public.current_profile_role() = 'scientist'
    and samples.assigned_scientist_id = auth.uid()
  )
  or (
    public.current_profile_role() = 'client'
    and samples.client_id = auth.uid()
  )
);

drop policy if exists "Lab managers can update samples" on public.samples;
create policy "Lab managers can update samples"
on public.samples
for update
to authenticated
using (public.current_profile_role() in ('admin', 'lab_manager'))
with check (public.current_profile_role() in ('admin', 'lab_manager'));

drop policy if exists "Lab managers can delete samples" on public.samples;
create policy "Lab managers can delete samples"
on public.samples
for delete
to authenticated
using (public.current_profile_role() in ('admin', 'lab_manager'));

drop policy if exists "Visible users can read sample activities" on public.sample_activities;
create policy "Visible users can read sample activities"
on public.sample_activities
for select
to authenticated
using (
  exists (
    select 1
    from public.samples
    where public.samples.id = sample_activities.sample_id
      and (
        public.current_profile_role() in ('admin', 'lab_manager')
        or (
          public.current_profile_role() = 'scientist'
          and public.samples.assigned_scientist_id = auth.uid()
        )
        or (
          public.current_profile_role() = 'client'
          and public.samples.client_id = auth.uid()
        )
      )
  )
);

drop policy if exists "Lab managers can insert sample activities" on public.sample_activities;
create policy "Lab managers can insert sample activities"
on public.sample_activities
for insert
to authenticated
with check (public.current_profile_role() in ('admin', 'lab_manager'));
