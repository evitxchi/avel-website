create table public.avel_contact_inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(btrim(name)) between 1 and 160),
  email text not null check (
    char_length(btrim(email)) between 3 and 320
    and email ~* '^[^[:space:]@]+@[^[:space:]@]+[.][^[:space:]@]+$'
  ),
  phone text check (phone is null or char_length(phone) <= 80),
  message text not null check (char_length(btrim(message)) between 1 and 4000),
  created_at timestamptz not null default now()
);

alter table public.avel_contact_inquiries enable row level security;

revoke all on table public.avel_contact_inquiries from public, anon, authenticated;
grant insert on table public.avel_contact_inquiries to anon;

create policy "Public can submit Avel contact inquiries"
  on public.avel_contact_inquiries
  for insert
  to anon
  with check (true);
