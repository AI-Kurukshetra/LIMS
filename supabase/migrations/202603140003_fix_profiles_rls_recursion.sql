-- RLS on profiles had policies that queried profiles again → infinite recursion (42P17).
-- This function MUST bypass RLS for its internal SELECT; otherwise "Lab staff can read all profiles"
-- calls current_profile_role() → reads profiles → evaluates same policy → recursion.

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

comment on function public.current_profile_role() is
  'Returns the app_role for auth.uid(); used in RLS to avoid recursive profiles subqueries.';

revoke all on function public.current_profile_role() from public;
grant execute on function public.current_profile_role() to authenticated;
grant execute on function public.current_profile_role() to service_role;

-- profiles: replace recursive policy
drop policy if exists "Lab staff can read all profiles" on public.profiles;
create policy "Lab staff can read all profiles"
on public.profiles
for select
to authenticated
using (public.current_profile_role() in ('admin', 'lab_manager', 'scientist'));

-- samples: replace recursive subqueries
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

-- sample_activities
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
