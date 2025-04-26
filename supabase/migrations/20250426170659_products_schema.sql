create table public.products (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text,
  price_per_kg numeric(10,2) not null, -- Rs 99.99 format
  image_url text,
  stock numeric(10,2) default 0, -- in Kg (or dozens for fruits)
  category_id uuid not null references public.categories(id) on delete cascade,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Trigger to auto-update updated_at
create or replace function update_product_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language 'plpgsql';

create trigger trigger_product_updated_at
before update on public.products
for each row
execute procedure update_product_updated_at();
