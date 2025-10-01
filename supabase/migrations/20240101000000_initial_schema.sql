-- Enable RLS (Row Level Security)
alter table auth.users enable row level security;

-- Create festivals table
create table public.festivals (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  university text not null,
  region text not null,
  start_date timestamptz not null,
  end_date timestamptz not null,
  location text not null,
  description text,
  lineup jsonb,
  booths jsonb,
  transportation jsonb,
  admission jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create favorites table
create table public.favorites (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  festival_id uuid references public.festivals(id) on delete cascade not null,
  created_at timestamptz default now(),
  unique(user_id, festival_id)
);

-- Enable RLS on tables
alter table public.festivals enable row level security;
alter table public.favorites enable row level security;

-- Create policies for festivals table (public read, authenticated users can insert/update/delete)
create policy "Festivals are viewable by everyone"
  on public.festivals for select
  using (true);

create policy "Authenticated users can insert festivals"
  on public.festivals for insert
  with check (auth.role() = 'authenticated');

create policy "Authenticated users can update festivals"
  on public.festivals for update
  using (auth.role() = 'authenticated');

create policy "Authenticated users can delete festivals"
  on public.festivals for delete
  using (auth.role() = 'authenticated');

-- Create policies for favorites table
create policy "Users can view their own favorites"
  on public.favorites for select
  using (auth.uid() = user_id);

create policy "Users can insert their own favorites"
  on public.favorites for insert
  with check (auth.uid() = user_id);

create policy "Users can delete their own favorites"
  on public.favorites for delete
  using (auth.uid() = user_id);

-- Create indexes for better performance
create index idx_festivals_region on public.festivals(region);
create index idx_festivals_start_date on public.festivals(start_date);
create index idx_festivals_university on public.festivals(university);
create index idx_favorites_user_id on public.favorites(user_id);
create index idx_favorites_festival_id on public.favorites(festival_id);

-- Create updated_at trigger function
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create trigger for festivals table
create trigger on_festivals_updated
  before update on public.festivals
  for each row execute procedure public.handle_updated_at();
