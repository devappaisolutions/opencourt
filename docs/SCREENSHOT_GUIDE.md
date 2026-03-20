# OpenCourt Screenshot Guide

## Setup Instructions

**URL:** https://opencourtph.vercel.app/
**Login:** alvagenesis@gmail.com
**Password:** aaMMpp71784.*
**Method:** Click "Continue with Google" button

---

## Screenshot Checklist

### ✅ Screenshot 1: Login Page
**File name:** `login.png`
**URL:** `https://opencourtph.vercel.app/login`
**What to capture:**
- Full login page showing:
  - OpenCourt logo and branding
  - "Continue with Google" button
  - "Continue with Facebook" button
  - Email/password input fields
  - Sign Up button

**Notes:** This screenshot already exists, but you may want to update it.

---

### 📝 Screenshot 2: Onboarding Screen
**File name:** `onboarding.png`
**URL:** `https://opencourtph.vercel.app/onboarding`
**What to capture:**
- The complete onboarding form showing:
  - Full Name field (pre-filled from Google)
  - Display Name field
  - Position dropdown (Point Guard, Shooting Guard, etc.)
  - Height field
  - Skill Level dropdown (Beginner, Casual, Competitive, Elite)
  - "Complete Profile" button

**How to get here:**
- If you've already completed onboarding, you may need to create a new test account OR manually navigate to `/onboarding`

---

### 🏠 Screenshot 3: Dashboard (Main View)
**File name:** `dashboard.png`
**URL:** `https://opencourtph.vercel.app/dashboard`
**What to capture:**
- Full dashboard showing:
  - Sidebar navigation (🏠 Dashboard, 📅 My Schedule, ➕ Host a Run, 👤 Profile)
  - Filter bar (ALL, TODAY 🔥, COMPETITIVE, CASUAL, NEAR ME 📍)
  - Grid of game cards with:
    - Game titles and locations
    - Format badges (Full Court / Half Court / 3-on-3)
    - Schedule (date/time)
    - Roster progress bars
    - Entry fees
    - JOIN RUN buttons

**Notes:** Make sure there are multiple game cards visible to show the grid layout.

---

### ➕ Screenshot 4: Join Run Modal (House Rules)
**File name:** `join-modal.png`
**URL:** `https://opencourtph.vercel.app/game/[id]`
**What to capture:**
- The house rules modal popup showing:
  - Game title at top
  - House rules text
  - "I AGREE & JOIN THE RUN" button
  - Close/cancel option

**How to get here:**
1. Go to dashboard
2. Find a game that HAS house rules
3. Click "JOIN RUN" button
4. The modal should pop up
5. Take screenshot BEFORE clicking agree

**Alternative:** If no games have house rules, you may need to host a test game with house rules first.

---

### 🏟️ Screenshot 5: Game Detail Page
**File name:** `game-detail.png`
**URL:** `https://opencourtph.vercel.app/game/[id]`
**What to capture:**
- Full game detail page showing:
  - Hero section with game title, format badge, skill level
  - Large "+ JOIN THE RUN" button
  - Game info section (location, schedule, description)
  - "Hosted By" card with host info
  - Squad Roster with player avatars and names
  - Waitlist section (if applicable)

**How to get here:**
1. From dashboard, click on any game card
2. You'll be taken to the game detail page

---

### 📍 Screenshot 6: Host Wizard - Step 1 (Location & Schedule)
**File name:** `host-step1.png`
**URL:** `https://opencourtph.vercel.app/host`
**What to capture:**
- Step 1 of the host wizard showing:
  - Progress indicator (Step 1/5)
  - Game Title input field
  - Location input field
  - Previous courts quick-select buttons (if any)
  - Date picker with Today/Tomorrow quick buttons
  - Start Time picker
  - "NEXT STEP →" button

**How to get here:**
1. Click the ➕ icon in sidebar OR
2. Click "HOST A RUN" button on dashboard

---

### 🏀 Screenshot 7: Host Wizard - Step 2 (Format)
**File name:** `host-step2.png`
**URL:** `https://opencourtph.vercel.app/host` (Step 2)
**What to capture:**
- Step 2 of the host wizard showing:
  - Progress indicator (Step 2/5)
  - Game Format options (Full Court with Ref, Full Court no Ref, Half Court, 3-on-3)
  - Max Players slider (15/20/25)
  - Competition Level options (Beginner, Casual, Competitive, Elite, Open Run)
  - "← BACK" and "NEXT STEP →" buttons

**How to get here:**
1. Start hosting a game (Step 1)
2. Fill in required fields
3. Click "NEXT STEP"

---

### ⚡ Screenshot 8: Host Wizard - Step 5 (Confirm & Publish)
**File name:** `host-step5.png`
**URL:** `https://opencourtph.vercel.app/host` (Step 5)
**What to capture:**
- Step 5 (final step) showing:
  - Progress indicator (Step 5/5)
  - Summary card with ALL game details:
    - Game title
    - Location
    - Date/time in readable format (e.g., "Mon, Mar 23 @ 7:00 PM")
    - Format, skill level, max players
    - Description and house rules
    - Gender/age filters
  - Entry Fee input field
  - "⚡ PUBLISH GAME" button

**How to get here:**
1. Go through all 5 steps of hosting
2. Fill in the details (you can use dummy data)
3. Don't click publish yet - take screenshot first!

---

### 👑 Screenshot 9: Host Controls (Host View)
**File name:** `host-controls.png`
**URL:** `https://opencourtph.vercel.app/game/[id]` (as host)
**What to capture:**
- Game detail page AS THE HOST showing:
  - Squad roster with host controls for each player:
    - ✅ Green checkmark (mark checked in)
    - ❌ Red X (mark absent)
    - 🗑️ Trash icon (kick player)
    - RESET button
  - Waitlist section with "SQUAD UP" buttons
  - Team Generator section with "Generate Teams" button
  - "✅ COMPLETE RUN" button
  - "❌ CANCEL RUN" button

**How to get here:**
1. Publish a game (complete the host wizard)
2. Open the game detail page
3. You should see extra host controls that regular players don't see

**Notes:** You may need to have some players join first to see the roster controls properly.

---

### 📅 Screenshot 10: My Schedule Page
**File name:** `my-schedule.png`
**URL:** `https://opencourtph.vercel.app/my-games`
**What to capture:**
- My Schedule page showing:
  - "HOST A RUN" shortcut button at top
  - "Upcoming Runs" section with games you've joined
    - "Next Up →" marker on the next upcoming game
  - "Hosted by You" section with:
    - Games you created
    - Status badges (OPEN, COMPLETED, CANCELLED)

**How to get here:**
1. Click the 📅 calendar icon in the sidebar
2. OR navigate to `/my-games`

**Notes:** You'll need to have joined some games and/or hosted some games for this to show properly.

---

### 👤 Screenshot 11: Profile Page
**File name:** `profile.png`
**URL:** `https://opencourtph.vercel.app/profile`
**What to capture:**
- Profile page showing:
  - Profile avatar
  - Editable fields:
    - Full Name
    - Display Name
    - Position dropdown
    - Height
    - Skill Level
    - Avatar URL
  - "Save Changes" button
  - Stats summary below (games played, reliability, win rate)

**How to get here:**
1. Click the 👤 person icon in the sidebar
2. OR navigate to `/profile`

---

### 📱 Screenshot 12: QR Check-In (Player Pass)
**File name:** `qr-checkin.png`
**URL:** `https://opencourtph.vercel.app/game/[id]`
**What to capture:**
- The Player Pass QR code modal showing:
  - "Player Pass" title
  - Large QR code in the center
  - Player name
  - Game title
  - Instructions text

**How to get here:**
1. Join a game first
2. Open that game's detail page
3. Click "📱 SHOW CHECK-IN QR" button
4. Modal with QR code should appear

---

## Screenshot Tips

### Best Practices:
1. **Use full browser window** - maximize your browser for consistent screenshots
2. **Clear resolution** - make sure text is readable
3. **Consistent browser** - use the same browser for all screenshots (Chrome recommended)
4. **Hide personal info** - if needed, use demo/test data
5. **Check lighting** - if using dark mode, make sure contrast is good

### Recommended Tools:
- **Windows:** Snipping Tool (Win + Shift + S) or Snip & Sketch
- **Windows Game Bar:** Win + G → Screenshot
- **Browser Extension:** Full Page Screen Capture (for long pages)

### File Format:
- Save as **PNG** format (not JPG) for better quality
- Name exactly as specified above

---

## After Taking Screenshots

Once you have all 12 screenshots:

1. Save them in: `c:\Users\pao\source\repos\OpenCourt\docs\screenshots\`
2. Let Claude know you're ready
3. Claude will update the HTML file with the proper image references

---

## Quick Checklist

- [ ] 1. login.png
- [ ] 2. onboarding.png
- [ ] 3. dashboard.png
- [ ] 4. join-modal.png
- [ ] 5. game-detail.png
- [ ] 6. host-step1.png
- [ ] 7. host-step2.png
- [ ] 8. host-step5.png
- [ ] 9. host-controls.png
- [ ] 10. my-schedule.png
- [ ] 11. profile.png
- [ ] 12. qr-checkin.png

---

**Good luck! Let me know when you have the screenshots ready and I'll integrate them into the HTML.**
