create table public.orders (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid, -- If you later use user login, otherwise you can skip it
  order_status text default 'pending', -- pending, confirmed, delivered, cancelled
  total_amount numeric(10,2) not null,
  delivery_address text not null,
  phone_number text not null,
  placed_at timestamptz default now()
);
