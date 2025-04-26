create table public.order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  quantity_kg numeric(10,2) not null, -- ordered quantity
  price_per_kg numeric(10,2) not null, -- in case price changes later
  total_price numeric(10,2) not null -- quantity * price snapshot
);
