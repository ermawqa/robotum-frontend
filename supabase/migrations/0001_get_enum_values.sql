-- Expose public-schema enum labels to the app.
--
-- PostgREST cannot read pg_catalog directly, so the site reads enum values
-- through this RPC instead. Adding/removing a value with
-- `ALTER TYPE ... ADD VALUE ...` is then picked up by the website with no
-- code change and no redeploy.
--
-- Only enum *labels* from the `public` schema are returned - no table data,
-- no PII - so it is safe to expose to anonymous visitors.
--
-- SECURITY DEFINER is safe here: the function takes no arguments (no injection
-- surface), is STABLE/read-only, and reads nothing but catalog metadata.

create or replace function public.get_enum_values()
returns table (enum_type text, enum_values text[])
language sql
stable
security definer
set search_path = pg_catalog, public
as $$
  select
    t.typname::text as enum_type,
    array_agg(e.enumlabel::text order by e.enumsortorder) as enum_values
  from pg_type t
  join pg_enum e on e.enumtypid = t.oid
  join pg_namespace n on n.oid = t.typnamespace
  where n.nspname = 'public'
  group by t.typname;
$$;

comment on function public.get_enum_values() is
  'Returns every enum type in the public schema with its labels in declared sort order. Used by the website to build category/status filters dynamically.';

-- Lock down, then grant read access explicitly.
revoke all on function public.get_enum_values() from public;
grant execute on function public.get_enum_values() to anon, authenticated;

-- PostgREST caches the schema; Supabase usually reloads it automatically after
-- DDL, but this makes the function callable immediately.
notify pgrst, 'reload schema';
