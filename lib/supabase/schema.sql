-- Create a table for public profiles
create table profiles (
  id uuid references auth.users not null primary key,
  updated_at timestamp with time zone,
  username text unique,
  full_name text,
  avatar_url text,
  position text check (position in ('Point Guard', 'Shooting Guard', 'Small Forward', 'Power Forward', 'Center', 'Guard', 'Forward', 'Big Man')),
  height_ft int,
  height_in int,
  skill_level text check (skill_level in ('Beginner', 'Casual', 'Competitive', 'Elite')),
  reliability_score int default 100,

  constraint username_length check (char_length(username) >= 3)
);

-- Set up Row Level Security (RLS) for profiles
alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- GAMES TABLE
create table games (
  id uuid default gen_random_uuid() primary key,
  host_id uuid references profiles(id) not null,
  created_at timestamp with time zone default now(),
  
  title text not null,
  location text not null,
  date_time timestamp with time zone not null, -- Combined date/time
  
  format text check (format in ('3v3', '4v4', '5v5', 'Drills')) not null,
  skill_level text check (skill_level in ('Casual', 'Intermediate', 'Competitive', 'Elite')) not null,
  
  cost text default 'Free',
  max_players int default 10,
  current_players int default 0,
  
  status text default 'open', -- open, full, cancelled, completed
  image_gradient text -- css class string for the card background
);

alter table games enable row level security;

create policy "Games are viewable by everyone."
  on games for select
  using ( true );

create policy "Authenticated users can create games."
  on games for insert
  with check ( auth.uid() = host_id );

create policy "Hosts can update their own games."
  on games for update
  using ( auth.uid() = host_id );

-- GAME ROSTER TABLE
create table game_roster (
  id uuid default gen_random_uuid() primary key,
  game_id uuid references games(id) not null,
  player_id uuid references profiles(id) not null,
  joined_at timestamp with time zone default now(),
  status text default 'joined', -- joined, waitlist, checked_in, absent

  unique(game_id, player_id) -- Prevent double joining
);

alter table game_roster enable row level security;

create policy "Rosters are viewable by everyone."
  on game_roster for select
  using ( true );

create policy "Players can join games (insert self)."
  on game_roster for insert
  with check ( auth.uid() = player_id );

create policy "Players can leave games (delete self)."
  on game_roster for delete
  using ( auth.uid() = player_id );
