create extension if not exists "pgcrypto";

-- ============================================================================
-- profiles
-- One row per auth.users row, created automatically by the trigger below.
-- ============================================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  phone text,
  name text not null,
  avatar text,
  role text not null default 'customer' check (role in ('customer', 'owner')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Profiles are publicly readable"
  on public.profiles for select
  using (true);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Auto-create a profile row whenever a new Supabase Auth user is created.
-- name/phone/role are read from the signUp() options.data payload.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, phone, name, role)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'phone',
    coalesce(new.raw_user_meta_data ->> 'name', new.email),
    coalesce(new.raw_user_meta_data ->> 'role', 'customer')
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================================
-- stores
-- ============================================================================
create table if not exists public.stores (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles (id) on delete cascade,
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

create policy "Active stores are publicly readable, owners can read their own"
  on public.stores for select
  using (is_active = true or owner_id = auth.uid());

create policy "Owners can create their own store"
  on public.stores for insert
  with check (owner_id = auth.uid());

create policy "Owners can update their own store"
  on public.stores for update
  using (owner_id = auth.uid());

create policy "Owners can delete their own store"
  on public.stores for delete
  using (owner_id = auth.uid());

-- ============================================================================
-- products
-- ============================================================================
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references public.stores (id) on delete cascade,
  name text not null,
  description text not null,
  price numeric(12, 2) not null,
  currency text not null check (currency in ('NGN', 'USD')),
  images text[] not null default '{}',
  category text not null,
  stock integer not null default 0,
  availability boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_store_id_idx on public.products (store_id);

alter table public.products enable row level security;

create policy "Products of active stores are publicly readable, owners can read their own"
  on public.products for select
  using (
    store_id in (select id from public.stores where is_active = true)
    or store_id in (select id from public.stores where owner_id = auth.uid())
  );

create policy "Owners can manage products of their own store"
  on public.products for all
  using (store_id in (select id from public.stores where owner_id = auth.uid()))
  with check (store_id in (select id from public.stores where owner_id = auth.uid()));

-- ============================================================================
-- orders
-- ============================================================================
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references public.stores (id) on delete cascade,
  customer_id uuid references public.profiles (id) on delete set null,
  customer_name text not null,
  customer_email text,
  customer_phone text not null,
  customer_address text,
  delivery_method text not null check (delivery_method in ('pickup', 'delivery')),
  subtotal numeric(12, 2) not null,
  total numeric(12, 2) not null,
  currency text not null check (currency in ('NGN', 'USD')),
  status text not null default 'pending'
    check (status in ('pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled')),
  payment_method text not null check (payment_method in ('paystack', 'flutterwave', 'pay_on_pickup')),
  payment_status text not null default 'pending' check (payment_status in ('pending', 'paid', 'failed')),
  payment_reference text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists orders_store_id_idx on public.orders (store_id);
create index if not exists orders_customer_id_idx on public.orders (customer_id);

alter table public.orders enable row level security;

-- Orders are placed by guests and signed-in customers alike (checkout doesn't
-- require an account), so insert is open; reads are scoped to the store
-- owner or the customer who placed the order.
create policy "Anyone can place an order"
  on public.orders for insert
  with check (customer_id is null or customer_id = auth.uid());

create policy "Store owners and the ordering customer can read an order"
  on public.orders for select
  using (
    store_id in (select id from public.stores where owner_id = auth.uid())
    or customer_id = auth.uid()
  );

create policy "Store owners can update orders on their own store"
  on public.orders for update
  using (store_id in (select id from public.stores where owner_id = auth.uid()));

-- ============================================================================
-- order_items
-- ============================================================================
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  product_id uuid references public.products (id) on delete set null,
  name text not null,
  price numeric(12, 2) not null,
  quantity integer not null,
  total numeric(12, 2) not null
);

create index if not exists order_items_order_id_idx on public.order_items (order_id);

alter table public.order_items enable row level security;

create policy "Anyone can add items to an order they can insert"
  on public.order_items for insert
  with check (
    order_id in (
      select id from public.orders
      where customer_id is null or customer_id = auth.uid()
    )
  );

create policy "Store owners and the ordering customer can read order items"
  on public.order_items for select
  using (
    order_id in (
      select id from public.orders
      where store_id in (select id from public.stores where owner_id = auth.uid())
        or customer_id = auth.uid()
    )
  );
