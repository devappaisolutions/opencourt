# Database Setup Guide

## Problem
You're seeing **"Database error querying schema"** because the database tables don't exist yet.

## Solution: Apply the Database Schema

Follow these steps to set up your database:

### Step 1: Open Supabase SQL Editor

1. Go to your Supabase project dashboard: https://contpckaomjbyzstkdbi.supabase.co
2. Click on **SQL Editor** in the left sidebar (looks like a `</>` icon)
3. Click **New query** button

### Step 2: Run the Schema Script

1. Open the file [`schema.sql`](file:///c:/Users/pao/source/repos/OpenCourt/lib/supabase/schema.sql) in VS Code
2. **Copy ALL the contents** (Ctrl+A, then Ctrl+C)
3. **Paste** into the Supabase SQL Editor
4. Click **Run** (or press Ctrl+Enter)

You should see a success message. This creates all the necessary tables:
- `profiles`
- `games`
- `game_roster`
- `team_assignments`
- `game_stats`

### Step 3: Run the Test Data Script

1. Open the file [`test_data.sql`](file:///c:/Users/pao/source/repos/OpenCourt/lib/supabase/test_data.sql)
2. **Copy ALL the contents**
3. **Paste** into a new query in Supabase SQL Editor
4. Click **Run**

This creates:
- 60 test users (2 hosts + 58 players)
- 8 games covering all scenarios
- Roster entries, team assignments, and stats

### Step 4: Try Logging In Again

Now go back to your app and log in with:
- **Email**: `host1@opencourt.test`
- **Password**: `password123`

The error should be gone! ✅

## Test Accounts

All test users have the same password: `password123`

**Hosts:**
- `host1@opencourt.test` - James Smith
- `host2@opencourt.test` - Michael Johnson

**Players:**
- `testuser3@opencourt.test` through `testuser60@opencourt.test`

## Troubleshooting

### Still getting errors?
1. Make sure you ran **schema.sql first**, then test_data.sql
2. Check that there are no error messages in the Supabase SQL Editor
3. Refresh your app page (Ctrl+R)

### Want to start fresh?
Run this in SQL Editor to clear all test data:
```sql
DELETE FROM game_stats WHERE game_id IN (SELECT id FROM games WHERE host_id IN (SELECT id FROM profiles WHERE username LIKE 'host%'));
DELETE FROM team_assignments WHERE game_id IN (SELECT id FROM games WHERE host_id IN (SELECT id FROM profiles WHERE username LIKE 'host%'));
DELETE FROM game_roster WHERE game_id IN (SELECT id FROM games WHERE host_id IN (SELECT id FROM profiles WHERE username LIKE 'host%'));
DELETE FROM games WHERE host_id IN (SELECT id FROM profiles WHERE username LIKE 'host%');
DELETE FROM profiles WHERE username LIKE 'testuser%' OR username LIKE 'host%';
DELETE FROM auth.users WHERE email LIKE '%@opencourt.test';
```

Then run test_data.sql again.
