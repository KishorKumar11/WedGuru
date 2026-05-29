# WedGuru Full Feature Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task.

**Goal:** Ship all P0–P3 non-vendor features across AI planner, dashboard, checklist, seating, co-planner, activity feed, family link, CSV, mobile RSVP, photo moderation, party tasks, onboarding, theme suggestions, marketing, and pro-planner workspace.

**Architecture:** Vercel serverless functions on MongoDB/Mongoose. React 19 + TypeScript frontend. Auth via HTTP-only JWT cookies. Groq API (OpenAI-compatible) for AI chat. All model extensions are additive (no breaking changes).

**Tech Stack:** React 19, TypeScript, Vite, Tailwind v4, Mongoose, Zod, Groq SDK, csv-stringify, framer-motion, Vercel functions.

---

## Task 1: Install groq-sdk

**Files:**
- Modify: `package.json` (via npm)

- [ ] Run `npm install groq-sdk`
- [ ] Commit: `chore: add groq-sdk`

---

## Task 2: Extend Models

**Files:**
- Modify: `lib/models/ChecklistItem.ts`
- Modify: `lib/models/Guest.ts`
- Modify: `lib/models/User.ts`
- Modify: `lib/models/Photo.ts`
- Modify: `src/lib/types.ts`
- Create: `lib/models/ActivityLog.ts`
- Create: `lib/models/PartyTask.ts`

### ChecklistItem — add assignee, dueDate
```typescript
// lib/models/ChecklistItem.ts additions
assignee?: string;   // "primary" | "co-planner" | name string
dueDate?: Date;
```

### Guest — add rsvpDeadline, conflictWith, seatTags
```typescript
rsvpDeadline?: Date;
conflictWith?: Schema.Types.ObjectId[];  // guest IDs to keep apart
seatTags?: string[];   // ["vegetarian","kids","wheelchair"]
```

### User — add role, coplannerOf, managedCouples
```typescript
role?: "primary" | "co-planner" | "planner-pro";
coplannerOf?: Schema.Types.ObjectId;  // primary user ID this co-planner belongs to
managedCouples?: Schema.Types.ObjectId[];  // for planner-pro
familyToken?: string;  // read-only family summary token
```

### Photo — add approved flag
```typescript
approved?: boolean;  // default true; false = pending moderation
```

### ActivityLog (new model)
```typescript
interface IActivityLog {
  userId: ObjectId;
  action: string;      // "added_guest" | "updated_budget" | etc.
  detail: string;      // human-readable e.g. "Added guest Sarah"
  createdAt: Date;
}
```

### PartyTask (new model)
```typescript
interface IPartyTask {
  userId: ObjectId;   // wedding owner
  assignedTo: string; // "Best Man" | "Maid of Honor" | custom
  title: string;
  dueDate?: Date;
  isCompleted: boolean;
  createdAt: Date;
}
```

---

## Task 3: AI Planner — Groq API

**Files:**
- Create: `api/ai/chat.ts`
- Modify: `src/pages/AiPlanner.tsx`

### api/ai/chat.ts
POST body: `{ messages: [{role, content}][] }`
Uses `groq-sdk` with model `llama-3.3-70b-versatile`.
Returns: `{ reply: string }`

System prompt: "You are WedGuru, an expert wedding planning assistant. Help couples plan their wedding — suggest timelines, budget breakdowns, vendor questions, checklist priorities, and seating tips. Be warm, practical, and concise."

### AiPlanner.tsx
Full chat UI: message list, input, send button, loading state, error handling.

---

## Task 4: Dashboard "This Week"

**Files:**
- Modify: `src/pages/Dashboard.tsx`

Logic: filter checklist items where `monthsBefore` phase matches current phase based on `weddingDate`. Show top 3 incomplete items as "do this week".

Phase mapping (months until wedding):
- >12 → "12mo"
- 7-12 → "12mo"
- 4-6 → "6mo"
- 2-3 → "3mo"
- 1 → "1mo"
- <1 → "1wk"

---

## Task 5: Budget Per-Category Alerts

**Files:**
- Modify: `src/pages/Budget.tsx`

Add per-category cap state. Show badge "Over" / "Near" per category row when actual > estimated cap.

---

## Task 6: Checklist Assignee + Due Date

**Files:**
- Modify: `api/checklist/index.ts` — add assignee, dueDate to schema
- Modify: `api/checklist/[id].ts` — allow PATCH of assignee, dueDate
- Modify: `src/lib/types.ts` — add fields to ChecklistItem type
- Modify: `src/components/ChecklistItem.tsx` — show assignee + dueDate
- Modify: `src/pages/Checklist.tsx` — add assignee dropdown + date picker on add

---

## Task 7: Guest RSVP Deadline

**Files:**
- Modify: `api/guests/index.ts` — accept rsvpDeadline on POST
- Modify: `src/pages/Guests.tsx` — deadline input per guest, show deadline badge
- Modify: `src/pages/Invite.tsx` — show deadline countdown

---

## Task 8: Seating Conflict Rules

**Files:**
- Modify: `src/pages/Seating.tsx` — show dietary badge, conflict warning on drop
- Modify: `api/guests/[id].ts` — allow PATCH of conflictWith + seatTags
- Modify: `src/pages/Guests.tsx` — add conflict + dietary tag inputs

Conflict detection: when assigning guest to table, check if any existing guest on that table has this guest in their `conflictWith` array.

---

## Task 9: Co-Planner Invite

**Files:**
- Create: `api/auth/invite-coplanner.ts` — POST, generates invite token for co-planner
- Create: `api/auth/accept-coplanner.ts` — GET/POST with token, creates/links co-planner account
- Modify: `lib/models/User.ts` — add `coplannerOf`, `coplannerInviteToken`
- Create: `src/pages/CoplannerInvite.tsx` — accept co-planner invite page
- Modify: `src/pages/Dashboard.tsx` — "Invite co-planner" button
- Modify: `src/App.tsx` — add /coplanner-invite/:token route
- Modify: `lib/api-auth.ts` — `getUserId` resolves co-planner → returns primary user's ID (transparent data sharing)

---

## Task 10: Activity Feed

**Files:**
- Create: `api/activity/index.ts` — GET last 50 logs for userId
- Create: `lib/models/ActivityLog.ts` (from Task 2)
- Create: `lib/activity.ts` — `logActivity(userId, action, detail)` helper
- Modify: `api/guests/index.ts` — call logActivity on POST
- Modify: `api/budget/index.ts` — call logActivity on POST
- Modify: `api/checklist/index.ts` — call logActivity on POST
- Create: `src/pages/Activity.tsx` — feed page
- Modify: `src/components/Sidebar.tsx` — add Activity link
- Modify: `src/App.tsx` — add /activity route

---

## Task 11: Read-Only Family Summary Link

**Files:**
- Create: `api/family/[token].ts` — public GET, returns budget totals + RSVP counts
- Modify: `api/wedding/index.ts` — generate familyToken on PUT if not exists
- Create: `src/pages/FamilySummary.tsx` — public read-only page
- Modify: `src/App.tsx` — add /family/:token route (no auth)
- Modify: `src/pages/Dashboard.tsx` — show "Family link" copy button

---

## Task 12: Guest CSV Import + Export

**Files:**
- Modify: `api/guests/index.ts` — GET ?format=csv returns CSV; POST /guests/import
- Create: `api/guests/import.ts` — POST with CSV body
- Modify: `src/pages/Guests.tsx` — Export CSV button + Import CSV file input

`csv-stringify` already in dependencies.

---

## Task 13: Mobile RSVP + Calendar Add

**Files:**
- Modify: `src/pages/Invite.tsx` — better mobile layout, add-to-calendar button, venue/map link
- Modify: `api/invite/[token].ts` — include wedding venue + date in GET response

Calendar link format: `https://calendar.google.com/calendar/render?action=TEMPLATE&text=Wedding&dates=...&details=...&location=...`

---

## Task 14: Photo Moderation + Party Upload Link

**Files:**
- Modify: `lib/models/Photo.ts` — add `approved: Boolean default true`, `uploadToken?: String`
- Modify: `api/photos/index.ts` — GET filters unapproved for couple; add POST /photos/party-upload (token-based, no auth)
- Create: `api/photos/party-upload.ts` — public POST with upload token
- Modify: `src/pages/PhotoWall.tsx` — show pending photos to owner, approve/reject; show "Copy party link" button

---

## Task 15: Party Tasks Page

**Files:**
- Create: `lib/models/PartyTask.ts` (from Task 2)
- Create: `api/party-tasks/index.ts` — GET/POST
- Create: `api/party-tasks/[id].ts` — PUT/DELETE
- Create: `src/pages/PartyTasks.tsx`
- Modify: `src/components/Sidebar.tsx` — add Party Tasks link
- Modify: `src/App.tsx` — add /party-tasks route

---

## Task 16: Onboarding Wizard

**Files:**
- Create: `src/pages/Onboarding.tsx` — 3-step wizard: wedding date, budget cap, guest count
- Modify: `src/App.tsx` — redirect new users (no weddingDate) to /onboarding after login/register
- Modify: `src/context/AuthContext.tsx` — expose `needsOnboarding` flag

---

## Task 17: Theme → Checklist/Budget Suggestions

**Files:**
- Create: `src/lib/theme-suggestions.ts` — map theme category → checklist tasks + budget items
- Modify: `src/pages/Themes.tsx` — "Apply to my plan" button on each card

---

## Task 18: Marketing / Landing Fix

**Files:**
- Modify: `src/pages/Landing.tsx` — update feature list to match reality, remove unbuilt claims, add AI Planner, Co-planner, Party Tasks

---

## Task 19: Multi-Wedding Planner Workspace

**Files:**
- Create: `api/planner/couples.ts` — list managed couples (GET), invite couple (POST)
- Create: `api/planner/switch.ts` — POST { coupleId } sets active wedding in session
- Modify: `lib/models/User.ts` — add `managedCouples`, `role: "planner-pro"`
- Create: `src/pages/PlannerWorkspace.tsx` — list couples + switch active
- Modify: `src/App.tsx` — /planner route (role-gated)
- Modify: `lib/api-auth.ts` — support `activeCouple` override from session/cookie

---

## Task 20: Client Portal

**Files:**
- Create: `api/planner/client-status.ts` — GET couple's summary from planner's POV
- Create: `src/pages/ClientPortal.tsx` — couple sees planner notes + status
- Modify: `src/App.tsx` — /client-portal route
- Modify: `src/components/Sidebar.tsx` — show for managed couples

---
