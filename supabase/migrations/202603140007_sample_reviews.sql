-- This migration adds scientist review feedback for samples.
-- The lab can use it to store review status and comments, while clients can read the outcome.
create extension if not exists pgcrypto;

do $$
begin
  create type public.sample_review_status as enum (
    'reviewed',
    'needs_changes',
    'approved'
  );
exception
  when duplicate_object then
    null;
end
$$;

create table if not exists public.sample_reviews (
  id uuid primary key default gen_random_uuid(),
  sample_id uuid not null references public.samples(id) on delete cascade,
  reviewer_id uuid not null references public.profiles(id) on delete restrict,
  review_status public.sample_review_status not null,
  feedback text not null,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

comment on table public.sample_reviews is 'Scientist review notes and decision history for each sample.';
comment on column public.sample_reviews.review_status is 'Simple decision label used by staff and clients.';
comment on column public.sample_reviews.feedback is 'Scientist review comment written in plain language.';

create index if not exists sample_reviews_sample_id_idx on public.sample_reviews (sample_id);
create index if not exists sample_reviews_reviewer_id_idx on public.sample_reviews (reviewer_id);
create index if not exists sample_reviews_created_at_idx on public.sample_reviews (created_at desc);

drop trigger if exists set_sample_reviews_updated_at on public.sample_reviews;
create trigger set_sample_reviews_updated_at
before update on public.sample_reviews
for each row
execute procedure public.set_current_timestamp_updated_at();

alter table public.sample_reviews enable row level security;

drop policy if exists "Visible users can read sample reviews" on public.sample_reviews;
create policy "Visible users can read sample reviews"
on public.sample_reviews
for select
to authenticated
using (
  exists (
    select 1
    from public.samples
    where public.samples.id = sample_reviews.sample_id
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

drop policy if exists "Assigned scientist can insert sample reviews" on public.sample_reviews;
create policy "Assigned scientist can insert sample reviews"
on public.sample_reviews
for insert
to authenticated
with check (
  reviewer_id = auth.uid()
  and exists (
    select 1
    from public.samples
    where public.samples.id = sample_reviews.sample_id
      and public.samples.assigned_scientist_id = auth.uid()
  )
);
