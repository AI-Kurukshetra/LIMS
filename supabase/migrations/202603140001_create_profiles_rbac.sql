-- This migration creates the profile table that stores roles for signed-in users.
create type public.app_role as enum (
  'admin',
  'lab_manager',
  'scientist',
  'technician',
  'qc_manager',
  'client'
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text not null default '',
  role public.app_role not null,
  created_at timestamptz not null default timezone('utc'::text, now())
);

create index if not exists profiles_role_idx on public.profiles (role);

alter table public.profiles enable row level security;

comment on table public.profiles is 'Application profile data linked to Supabase auth users.';
comment on column public.profiles.role is 'Role used by middleware and server checks to decide access.';

-- Auth users can read their own profile so the app can decide where to redirect them.
create policy "Users can read their own profile"
on public.profiles
for select
to authenticated
using (auth.uid() = id);

-- This lets the client create or repair its own profile if needed after signup.
create policy "Users can insert their own profile"
on public.profiles
for insert
to authenticated
with check (auth.uid() = id);

-- This allows a user to keep their own name and email in sync later if you add profile editing.
create policy "Users can update their own profile"
on public.profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

create or replace function public.handle_new_user_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  selected_role public.app_role;
begin
  selected_role := case
    when new.raw_user_meta_data ->> 'role' in (
      'admin',
      'lab_manager',
      'scientist',
      'technician',
      'qc_manager',
      'client'
    )
      then (new.raw_user_meta_data ->> 'role')::public.app_role
    else 'client'
  end;

  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    selected_role
  )
  on conflict (id) do update
  set
    email = excluded.email,
    full_name = excluded.full_name,
    role = excluded.role;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute procedure public.handle_new_user_profile();

-- Backfill profiles for users who signed up before this RBAC migration existed.
insert into public.profiles (id, email, full_name, role)
select
  users.id,
  coalesce(users.email, ''),
  coalesce(users.raw_user_meta_data ->> 'full_name', ''),
  case
    when users.raw_user_meta_data ->> 'role' in (
      'admin',
      'lab_manager',
      'scientist',
      'technician',
      'qc_manager',
      'client'
    )
      then (users.raw_user_meta_data ->> 'role')::public.app_role
    else 'client'
  end
from auth.users as users
where not exists (
  select 1
  from public.profiles
  where profiles.id = users.id
);
