create extension if not exists "uuid-ossp";

create table public.categories (
  id uuid primary key default uuid_generate_v4(),
  name_en text not null unique,
  name_te text not null,
  slug text unique,
  image_url text,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Optional: Trigger to auto-update updated_at
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language 'plpgsql';

create trigger set_updated_at
before update on public.categories
for each row
execute procedure update_updated_at_column();
