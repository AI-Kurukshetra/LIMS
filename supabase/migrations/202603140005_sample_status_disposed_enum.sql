-- PostgreSQL requires a commit after adding a new enum value before it can be used.
-- This migration only adds the new lifecycle state.
do $$
begin
  alter type public.sample_status add value 'disposed';
exception
  when duplicate_object then
    null;
end
$$;
