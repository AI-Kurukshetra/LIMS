-- Fix: STABLE + SET LOCAL caused "SET is not allowed in a non-volatile function".
-- Recreate as VOLATILE so row_security can be turned off inside the function body.
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
