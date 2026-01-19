-- Create a table for game reviews (Phase 4)
create table game_reviews (
  id uuid default gen_random_uuid() primary key,
  game_id uuid references games(id) not null,
  reviewer_id uuid references profiles(id) not null,
  reviewee_id uuid references profiles(id) not null,
  
  rating int check (rating >= 1 and rating <= 5), -- 1-5 stars
  comment text,
  categories text[], -- e.g. ['Team Player', 'Skilled', 'Reliable']
  
  created_at timestamp with time zone default now(),
  
  unique(game_id, reviewer_id, reviewee_id) -- Prevent duplicate reviews for the same person in the same game
);

alter table game_reviews enable row level security;

create policy "Reviews are viewable by everyone."
  on game_reviews for select
  using ( true );

create policy "Authenticated users can create reviews for games they joined."
  on game_reviews for insert
  with check ( 
    auth.uid() = reviewer_id 
    and exists (
      select 1 from game_roster 
      where game_id = game_reviews.game_id 
      and player_id = auth.uid()
    )
  );

-- Function to update reliability score based on attendance (refinement)
-- This was already planned but let's ensure it exists if needed.
