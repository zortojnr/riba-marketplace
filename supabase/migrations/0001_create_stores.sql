create extension if not exists "pgcrypto";

create table if not exists public.stores (
  id uuid primary key default gen_random_uuid(),
  owner_id text not null,
  name text not null,
  business_name text not null,
  business_type text not null check (business_type in ('food', 'products', 'services')),
  description text not null,
  phone text not null,
  address text not null,
  city text not null,
  state text not null,
  website text,
  slug text not null unique,
  theme_color text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists stores_owner_id_idx on public.stores (owner_id);

alter table public.stores enable row level security;

-- NOTE: the app does not use Supabase Auth yet (see src/contexts/AuthContext.tsx,
-- which runs its own local session), so auth.uid() isn't available to scope
-- these policies to the actual owner. These policies are intentionally
-- permissive until real Supabase Auth is wired up app-wide, not just here.
-- Tighten to `owner_id = auth.uid()`-style checks once that lands.
create policy "Public can read active stores"
  on public.stores for select
  using (is_active = true);

create policy "Anyone can insert a store"
  on public.stores for insert
  with check (true);

create policy "Anyone can update a store"
  on public.stores for update
  using (true);
