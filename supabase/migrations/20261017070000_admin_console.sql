-- Milestone 7: administrator role is provisioned by trusted database operators only.
-- Authenticated users may read their own profile, but cannot grant themselves
-- or another account the administrator role through the public API.

drop policy if exists profiles_admin_update on public.profiles;
drop policy if exists profiles_admin_insert on public.profiles;
drop policy if exists profiles_admin_delete on public.profiles;

revoke all on table public.profiles from anon, authenticated;
grant select on table public.profiles to authenticated;

