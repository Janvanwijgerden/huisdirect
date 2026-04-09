alter table public.listings
  add column if not exists source_street text,
  add column if not exists source_house_number text,
  add column if not exists source_house_number_addition text,
  add column if not exists source_postal_code text,
  add column if not exists source_city text,
  add column if not exists source_lat double precision,
  add column if not exists source_lng double precision,
  add column if not exists source_build_year integer,
  add column if not exists source_living_area integer,
  add column if not exists source_plot_area integer,
  add column if not exists source_property_type text,
  add column if not exists source_energy_label text,
  add column if not exists source_woz_value bigint,
  add column if not exists source_data_provider text,
  add column if not exists estimated_value_low bigint,
  add column if not exists estimated_value_mid bigint,
  add column if not exists estimated_value_high bigint,
  add column if not exists valuation_source text,
  add column if not exists valuation_model_version text,
  add column if not exists valuation_confidence integer,
  add column if not exists valuation_price_per_m2 integer,
  add column if not exists valuation_metadata jsonb default '{}'::jsonb;

create index if not exists listings_source_postal_code_idx
  on public.listings (source_postal_code);

create index if not exists listings_source_city_idx
  on public.listings (source_city);

create index if not exists listings_estimated_value_mid_idx
  on public.listings (estimated_value_mid);