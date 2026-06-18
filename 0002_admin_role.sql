-- RIBA Marketplace: admin role
-- Run this once in the Supabase SQL Editor, AFTER 0001_init.sql.
--
-- This does NOT create any admin accounts. There is no signup flow for
-- admin and there never should be. After running this, promote one
-- specific person manually, directly in the SQL Editor:
--
--   update public.profiles set role = 'admin' where email = 'you@example.com';
--
-- Never add a UI path that lets a user set their own role to 'admin'.

-- Allow 'admin' as a valid role value.
-- (Postgres auto-names this constraint profiles_role_check; if your
-- project named it differently, find the real name first with:
--   select conname from pg_constraint where conrelid = 'public.profiles'::regclass;
-- and substitute it below.)
alter table public.profiles drop constraint profiles_role_check;
alter table public.profiles add constraint profiles_role_check
  check (role in ('customer', 'owner', 'admin'));

-- Security-definer helper so checking "is this caller an admin" inside a
-- policy doesn't recursively re-trigger RLS on profiles itself.
create or replace function public.is_admin()
returns boolean as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$ language sql security definer stable set search_path = public;

-- Everything below is ADDITIVE: new policies alongside the existing ones,
-- not replacements. Postgres OR's multiple permissive policies together,
-- so none of the original owner/customer access rules change.

create policy "profiles_select_admin"
  on public.profiles for select
  using (public.is_admin());

create policy "stores_select_admin"
  on public.stores for select
  using (public.is_admin());

create policy "stores_update_admin"
  on public.stores for update
  using (public.is_admin());

create policy "products_select_admin"
  on public.products for select
  using (public.is_admin());

create policy "orders_select_admin"
  on public.orders for select
  using (public.is_admin());

create policy "order_items_select_admin"
  on public.order_items for select
  using (public.is_admin());
  