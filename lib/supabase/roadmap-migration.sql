-- Add persistence for usual courts
create table usual_courts (
  id uuid default gen_random_uuid() primary key,
  host_id uuid references profiles(id) not null,
  name text not null,
  address text,
  created_at timestamp with time zone default now()
);

alter table usual_courts enable row level security;

create policy "Usual courts are viewable by everyone."
  on usual_courts for select
  using ( true );

create policy "Users can manage their own usual courts."
  on usual_courts for insert
  with check ( auth.uid() = host_id );

-- Add filtering columns to games
alter table games add column age_range text default 'All Ages';
alter table games add column gender_filter text check (gender_filter in ('Mixed', 'Mens', 'Womens')) default 'Mixed';
alter table games add column latitude double precision;
alter table games add column longitude double precision;
