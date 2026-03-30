-- ============================================================
-- Huisje — Supabase Schema
-- Run this in your Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ─────────────────────────────────────────
-- PROFILES
-- ─────────────────────────────────────────
create table if not exists public.profiles (
  id          uuid references auth.users on delete cascade primary key,
  full_name   text,
  avatar_url  text,
  created_at  timestamptz default now() not null,
  updated_at  timestamptz default now() not null
);

alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone."
  on profiles for select using (true);

create policy "Users can insert their own profile."
  on profiles for insert with check (auth.uid() = id);

create policy "Users can update own profile."
  on profiles for update using (auth.uid() = id);

-- Auto-create profile on sign-up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─────────────────────────────────────────
-- LISTINGS
-- ─────────────────────────────────────────
create table if not exists public.listings (
  id              uuid default uuid_generate_v4() primary key,
  user_id         uuid references auth.users on delete cascade not null,
  title           text not null,
  price           integer not null,
  description     text not null,
  location        text not null,
  city            text not null,
  images          text[] default '{}',
  bedrooms        integer,
  bathrooms       integer,
  area_m2         integer,
  property_type   text not null default 'house',
  status          text not null default 'active' check (status in ('active', 'sold', 'draft')),
  featured        boolean not null default false,
  created_at      timestamptz default now() not null,
  updated_at      timestamptz default now() not null
);

alter table public.listings enable row level security;

-- Anyone can view active listings
create policy "Active listings are public."
  on listings for select
  using (status = 'active' or auth.uid() = user_id);

-- Authenticated users can insert
create policy "Authenticated users can create listings."
  on listings for insert
  with check (auth.uid() = user_id);

-- Owners can update their own listings
create policy "Owners can update their listings."
  on listings for update
  using (auth.uid() = user_id);

-- Owners can delete their own listings
create policy "Owners can delete their listings."
  on listings for delete
  using (auth.uid() = user_id);

-- Indexes for performance
create index if not exists listings_user_id_idx on public.listings(user_id);
create index if not exists listings_city_idx on public.listings(city);
create index if not exists listings_status_idx on public.listings(status);
create index if not exists listings_featured_idx on public.listings(featured);

-- ─────────────────────────────────────────
-- STORAGE BUCKET (images)
-- ─────────────────────────────────────────
-- Run this separately if you want image uploads:
-- insert into storage.buckets (id, name, public)
-- values ('listing-images', 'listing-images', true);

-- create policy "Public read access for listing images."
--   on storage.objects for select using (bucket_id = 'listing-images');

-- create policy "Authenticated users can upload listing images."
--   on storage.objects for insert
--   with check (bucket_id = 'listing-images' and auth.role() = 'authenticated');

-- ─────────────────────────────────────────
-- SEED DATA (optional — for testing)
-- ─────────────────────────────────────────
-- insert into public.listings (user_id, title, price, description, location, city, bedrooms, bathrooms, area_m2, property_type, featured)
-- values
--   (auth.uid(), 'Charming Canal House', 850000, 'A beautiful canal house in the heart of Amsterdam.', 'Prinsengracht 123', 'Amsterdam', 3, 2, 145, 'house', true),
--   (auth.uid(), 'Modern Apartment', 395000, 'Bright, modern apartment with balcony.', 'Overtoom 45', 'Amsterdam', 2, 1, 78, 'apartment', false);
