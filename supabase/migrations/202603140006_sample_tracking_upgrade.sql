-- This migration upgrades the sample module into a fuller tracking feature.
-- It adds founder-friendly fields such as accession number, barcode, intake details,
-- location tracking, custody history, and disposal information.
create extension if not exists pgcrypto;

-- Priority keeps urgent work visible in a simple business-friendly way.
do $$
begin
  create type public.sample_priority as enum ('routine', 'urgent', 'stat');
exception
  when duplicate_object then
    null;
end
$$;

-- These event labels drive the chain-of-custody timeline in the UI.
do $$
begin
  create type public.sample_custody_event_type as enum ('received', 'handoff', 'storage_update');
exception
  when duplicate_object then
    null;
end
$$;

-- Generate a readable accession number automatically when a sample is created.
create or replace function public.generate_sample_accession_number()
returns text
language sql
as $$
  select concat(
    'SMP-',
    to_char(timezone('utc'::text, now()), 'YYYYMMDD'),
    '-',
    upper(substring(replace(gen_random_uuid()::text, '-', '') from 1 for 6))
  );
$$;

-- Add intake and lifecycle fields to the existing samples table.
alter table public.samples
  add column if not exists accession_number text,
  add column if not exists barcode_value text,
  add column if not exists source_label text,
  add column if not exists priority public.sample_priority not null default 'routine',
  add column if not exists received_at timestamptz not null default timezone('utc'::text, now()),
  add column if not exists current_location text,
  add column if not exists disposal_reason text,
  add column if not exists disposed_at timestamptz,
  add column if not exists disposed_by uuid references public.profiles(id) on delete set null;

update public.samples
set accession_number = public.generate_sample_accession_number()
where accession_number is null;

alter table public.samples
  alter column accession_number set not null,
  alter column accession_number set default public.generate_sample_accession_number();

create unique index if not exists samples_accession_number_key on public.samples (accession_number);
create unique index if not exists samples_barcode_value_key
  on public.samples (barcode_value)
  where barcode_value is not null;
create index if not exists samples_priority_idx on public.samples (priority);
create index if not exists samples_received_at_idx on public.samples (received_at desc);

alter table public.samples
  drop constraint if exists samples_disposal_consistency_check;

alter table public.samples
  add constraint samples_disposal_consistency_check
  check (
    (
      status = 'disposed'
      and disposed_at is not null
      and disposed_by is not null
      and disposal_reason is not null
      and length(trim(disposal_reason)) > 0
    )
    or (
      status <> 'disposed'
      and disposed_at is null
      and disposed_by is null
      and disposal_reason is null
    )
  );

comment on column public.samples.accession_number is 'Readable sample number shown to staff and clients.';
comment on column public.samples.barcode_value is 'Optional barcode value that can later be printed or scanned.';
comment on column public.samples.source_label is 'Simple source or collection detail such as Ward A or External Clinic.';
comment on column public.samples.priority is 'Routine, urgent, or STAT priority for the laboratory team.';
comment on column public.samples.received_at is 'When the laboratory received the sample.';
comment on column public.samples.current_location is 'Current storage or handling location for the sample.';
comment on column public.samples.disposal_reason is 'Reason entered when the sample is finally disposed.';

-- This table records who received or moved a sample and where it went next.
create table if not exists public.sample_custody_events (
  id uuid primary key default gen_random_uuid(),
  sample_id uuid not null references public.samples(id) on delete cascade,
  event_type public.sample_custody_event_type not null,
  from_profile_id uuid references public.profiles(id) on delete set null,
  to_profile_id uuid references public.profiles(id) on delete set null,
  location text,
  notes text not null default '',
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now()),
  created_by uuid references public.profiles(id) on delete set null
);

comment on table public.sample_custody_events is 'Readable chain-of-custody timeline for each sample.';

create index if not exists sample_custody_events_sample_id_idx on public.sample_custody_events (sample_id);
create index if not exists sample_custody_events_created_at_idx on public.sample_custody_events (created_at desc);

drop trigger if exists set_sample_custody_events_updated_at on public.sample_custody_events;
create trigger set_sample_custody_events_updated_at
before update on public.sample_custody_events
for each row
execute procedure public.set_current_timestamp_updated_at();

alter table public.sample_custody_events enable row level security;

drop policy if exists "Visible users can read sample custody events" on public.sample_custody_events;
create policy "Visible users can read sample custody events"
on public.sample_custody_events
for select
to authenticated
using (
  exists (
    select 1
    from public.samples
    where public.samples.id = sample_custody_events.sample_id
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

drop policy if exists "Lab managers can insert sample custody events" on public.sample_custody_events;
create policy "Lab managers can insert sample custody events"
on public.sample_custody_events
for insert
to authenticated
with check (public.current_profile_role() in ('admin', 'lab_manager'));
