# OpenCourt Database Scripts

This directory contains all database scripts for the OpenCourt application.

## Files

### 1. **schema.sql** - Complete Database Schema
Creates the entire database structure including:
- Tables: `profiles`, `games`, `game_roster`, `usual_courts`, `peer_reviews`
- Row Level Security (RLS) policies
- Triggers for reliability scoring and player count updates
- Indexes for performance
- Comments and constraints

**Usage:**
```bash
# Using Supabase CLI
supabase db reset

# Or manually in Supabase SQL Editor
# Copy and paste the entire schema.sql file
```

### 2. **reset.sql** - Data Reset Script
**⚠️ WARNING: This deletes ALL data!**

Safely truncates all tables in the correct order to avoid foreign key conflicts.

**Usage:**
```bash
# In Supabase SQL Editor
# Copy and paste reset.sql
# Verify all row counts are 0
```

### 3. **seed.sql** - Test Data Generator
Creates 100 realistic test games with:
- Varied game statuses (open, completed, cancelled)
- Random dates (3 months past to 3 months future)
- Realistic rosters with different player statuses
- Geographic coordinates for map features
- Summary statistics output

**Prerequisites:**
- At least one user must exist in the `profiles` table
- Run after `schema.sql`

**Usage:**
```bash
# In Supabase SQL Editor
# Copy and paste seed.sql
# Check the summary statistics output
```

## Setup Workflow

### Initial Setup
```bash
# 1. Create database schema
supabase db reset
# Or run schema.sql in SQL Editor

# 2. Create test users (via your app or Supabase Auth)

# 3. Seed test data
# Run seed.sql in SQL Editor
```

### Reset and Reseed
```bash
# 1. Reset all data
# Run reset.sql

# 2. Reseed test data
# Run seed.sql
```

## Database Structure

```
profiles (users)
  ├── games (hosted by users)
  │   ├── game_roster (players in games)
  │   └── peer_reviews (reviews after games)
  └── usual_courts (saved court locations)
```

## Key Features

- **Reliability System**: Automatic score updates based on attendance
- **Waitlist Management**: Auto-promotion when slots open
- **Real-time Updates**: Optimized with indexes for fast queries
- **Security**: Row Level Security on all tables
- **Cascading Deletes**: Proper cleanup when games/users are deleted

## Notes

- All IDs use UUID for security
- Timestamps use `TIMESTAMP WITH TIME ZONE`
- Reliability scores range from 0-100
- Geographic coordinates use DECIMAL(10,8) and DECIMAL(11,8)
