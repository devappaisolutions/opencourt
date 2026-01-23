# Test Data for OpenCourt

## Quick Start

Run this script in your Supabase SQL Editor to create comprehensive test data:

```sql
-- Copy and paste the contents of test_data.sql
```

## What Gets Created

- **60 Users**: 2 hosts (`host1`, `host2`) + 58 players (`testuser3` - `testuser60`)
- **8 Games**: 4 per host covering all scenarios
- **70+ Roster Entries**: Various statuses (joined, waitlist, checked_in, absent)
- **Team Assignments**: For completed games
- **Game Stats**: For completed games with checked-in players

## Game Scenarios

| # | Host | Title | Status | Players | Scenario |
|---|------|-------|--------|---------|----------|
| 1 | host1 | 5v5 Casual Run | Open | 5/10 | Normal open game |
| 2 | host1 | 5v5 Competitive Run | Full | 10/10 + 3 waitlist | Full game with waitlist |
| 3 | host1 | 5v5 Elite Practice | Completed | 10/10 all checked in | Perfect attendance + stats |
| 4 | host1 | 4v4 Weekend Hoops | Completed | 8 checked in, 2 absent | Game with no-shows |
| 5 | host2 | 5v5 Morning Run | Open | 3/12 | Low attendance |
| 6 | host2 | 3v3 Pickup Game | Cancelled | 8 joined | Cancelled game |
| 7 | host2 | 5v5 Serious Runs Only | Open | 6/10 | Game happening today |
| 8 | host2 | 5v5 Draft Night | Completed | 9 checked in, 1 absent | Recent completed game |

## User Credentials

All test users can log in with:
- **Password**: `password123`
- **Email format**: `[username]@opencourt.test`

### Hosts
- **host1** - James Smith
  - Email: `host1@opencourt.test`
- **host2** - Michael Johnson
  - Email: `host2@opencourt.test`

### Players
- **testuser3** through **testuser60** (58 players)
  - Email: `testuser3@opencourt.test`, `testuser4@opencourt.test`, etc.
- Varied reliability scores (30-100)
- Different skill levels and positions

> **Note**: These users are created in both `auth.users` and `profiles` tables, so you can actually log in with them!

## Clear Test Data (Optional)

To remove test data, uncomment these lines at the top of `test_data.sql`:

```sql
DELETE FROM game_stats WHERE game_id IN (SELECT id FROM games WHERE host_id IN (SELECT id FROM profiles WHERE username LIKE 'host%'));
DELETE FROM team_assignments WHERE game_id IN (SELECT id FROM games WHERE host_id IN (SELECT id FROM profiles WHERE username LIKE 'host%'));
DELETE FROM game_roster WHERE game_id IN (SELECT id FROM games WHERE host_id IN (SELECT id FROM profiles WHERE username LIKE 'host%'));
DELETE FROM games WHERE host_id IN (SELECT id FROM profiles WHERE username LIKE 'host%');
DELETE FROM profiles WHERE username LIKE 'testuser%' OR username LIKE 'host%';
DELETE FROM auth.users WHERE email LIKE '%@opencourt.test';
```

## Files

- [`test_data.sql`](file:///c:/Users/pao/source/repos/OpenCourt/lib/supabase/test_data.sql) - Main test data script
- [`schema.sql`](file:///c:/Users/pao/source/repos/OpenCourt/lib/supabase/schema.sql) - Database schema
- [`seed.sql`](file:///c:/Users/pao/source/repos/OpenCourt/lib/supabase/seed.sql) - Original seed script (100 games)
- [`reset.sql`](file:///c:/Users/pao/source/repos/OpenCourt/lib/supabase/reset.sql) - Database reset script
