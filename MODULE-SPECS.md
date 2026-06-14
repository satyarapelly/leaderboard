# MODULE-SPECS.md — features, pages, actions, status, alerts

Companion to `README.md`. The README is the *structure*; this file is the *behavior* — every page, action, what saves and when, each status lifecycle and what it triggers, and the alerts/notifications engine. Build against this so module interactions match intent instead of being guessed.

> **Schema note:** the behaviors here need a few additions (history + notifications + extra date columns). Put them in a **new** migration `supabase/migrations/0002_operations.sql` — do not edit `0001_init.sql`. Additions are listed at the end.

---

## Global conventions

**Saving (autosave-first).**
- Quick-add (Contact fast-capture) saves on submit, instantly.
- Detail screens autosave each field on blur (text/number) or on change (select/toggle/date). No global "Save" button; show a small "Saved" tick.
- Drag actions (kanban) save immediately on drop.
- Destructive actions (archive/delete) require a confirm dialog. Records are **archived** (`archived_at`), never hard-deleted.

**Date stamping (explicit rules).**
- `created_at` / `updated_at` — automatic (trigger).
- `last_contact` — stamped to today when you **Log a touch** on a contact, or when an activity linked to that contact is marked **Done**.
- Any status/stage change writes a **`status_history`** row (entity, from, to, changed_at, changed_by).
- `stage_changed_at`, `status_changed_at` — updated on each transition.
- `disbursed_date`, `milestone_date`, `next_action_date`, activity `date` — user-set via date pickers.

**Offline.** Reads served from cache; writes queue locally (IndexedDB) and sync on reconnect. Show a "pending sync" badge on queued items.

**UI feedback.** Every action gives a toast ("Contact saved", "Moved to MoU"). Errors are non-blocking toasts with retry.

---

## Notifications & alerts (cross-cutting engine)

A single **"Needs attention"** panel on the dashboard plus a bell icon with a count. v1 computes alerts from queries on load; v1.5 adds a `notifications` table + PWA push + a daily email digest.

| Alert | Trigger condition | Source | Severity |
|---|---|---|---|
| Follow-up due | `next_action_date <= today` (contacts & funding) | Contacts, Funding | high |
| Contact going cold | `last_contact < today − COLD_DAYS` (default 30) and no future next_action | Contacts | medium |
| Funding stale | proposal in same stage > STALE_DAYS (default 21), not Disbursed/Declined | Funding | medium |
| Activity upcoming | `status=planned` and `date` is today or tomorrow | Activities | info |
| Activity overdue | `status=planned` and `date < today` | Activities | high |
| Milestone due | program `milestone_date <= today + 7` | Programs | medium |
| Disbursement received | funding moved to `disbursed` | Funding | celebrate |
| Badge earned | a milestone threshold crossed (see Dashboard) | Dashboard | celebrate |

**Delivery (v1):** in-app panel + bell, grouped by severity, each item deep-links to the record. **Reminders:** Notion-Calendar-style — anything with a date shows on the calendar; "due today/overdue" surfaces in the panel. **Later:** browser push for due/overdue items and a morning email digest of "today's follow-ups + overdue".

Thresholds (`COLD_DAYS`, `STALE_DAYS`, etc.) live in **Settings**, editable.

---

## Module 1 — Contact Pool

**Pages**
- **Pool** (`/contacts`) — searchable, filterable list; floating **+** for fast-add.
- **Contact detail** (`/contacts/[id]`) — info, touch history, linked activities, actions.
- **Fast-add modal** — Name, Phone, Category only; one tap to save.
- **Pre-visit lookup** (`/visit`) — pick mandal/village → list of everyone known there.

**Actions**
- **Add** — saves with 3 fields; opens detail for optional enrichment.
- **Enrich** — affiliation, designation, location, how-met, referred-by, email, photo, tags, influence, notes (autosave each).
- **Log a touch** — one tap: stamps `last_contact=today`, optionally opens "create activity" prefilled with this contact.
- **Set next action + date** — adds them to the follow-up/"this week" engine.
- **Call / WhatsApp / Email** — one-tap deep links (`tel:`, `wa.me`, `mailto:`).
- **Add photo** — camera/upload to Supabase Storage.
- **Archive** — confirm; sets `archived_at`.

**Data & dates saved:** `created_at` on add; `last_contact` on each touch; `next_action_date` when set; `updated_at` on any edit.

**Engagement status (derived, not a hard stage):** `New` (no touch yet) → `Active` (touched, future next-action set) → `Cold` (last_contact older than `COLD_DAYS` and no upcoming action). Shown as a colored dot; drives the "going cold" alert.

**Alerts:** follow-up due; going cold.

---

## Module 2 — Funding

**Pages**
- **Pipeline** (`/funding`) — kanban, columns = stages.
- **Funding detail** — funder + program links, amount/target, stage history, next action.

**Actions**
- **Create** proposal.
- **Move stage** — drag card OR change in detail. Writes `status_history`, updates `stage_changed_at`.
- **Link** funder (contact) and program.
- **Edit** amount / target (autosave; drives progress bar).
- **Mark MoU / Disbursed** — prompts for `disbursed_date` and confirms amount on Disbursed.
- **Set next action + date.**
- **Archive.**

**Status lifecycle**

| From | Allowed to |
|---|---|
| Identified | Drafting, Declined |
| Drafting | Submitted, Declined |
| Submitted | In discussion, Declined |
| In discussion | MoU, Declined |
| MoU | Disbursed, Declined |
| Disbursed | (terminal) |
| Declined | Identified (re-open) |

**Transition triggers**
- → **MoU / Disbursed:** prompt for date (+ amount on Disbursed).
- → **Disbursed:** if linked program is `Planned`, suggest flipping it to `Funded`; fire "Disbursement received" celebrate alert; add to raised-vs-target scoreboard.
- **Any move:** prompt "what's the next action?" if `next_action` is empty.

**Cross-module:** pipeline value (by stage) and raised-vs-target feed the dashboard; Disbursed updates program funding state.

**Alerts:** follow-up due; funding stale; disbursement received.

---

## Module 3 — Programs

**Pages:** program **cards** (`/programs`), **detail**, add/edit.

**Actions**
- **Create**; set theme, scope, location, beneficiaries_target.
- **Set status** (writes `status_history`).
- **Log progress** — update `beneficiaries_reached` (autosave; drives impact bar + leaderboard).
- **Set next milestone + date.**
- **Assign team lead**; **link funding**.
- **Archive.**

**Status lifecycle**

| From | Allowed to | Note |
|---|---|---|
| Planned | Funded, Running, Paused | Funded auto-suggested when linked funding disburses |
| Funded | Running, Paused | |
| Running | Paused, Complete | counts toward mandal coverage while Running |
| Paused | Running, Complete | |
| Complete | (terminal) | |

**Triggers:** → Running adds the program to leaderboard scoring for its mandal; `beneficiaries_reached` changes recompute impact scoreboard + coverage score.

**Alerts:** milestone due/overdue; long-paused nudge.

---

## Module 4 — Activities & Events

**Pages:** **calendar** (month/week, `/activities`), **list**, **day view**, add/edit.

**Actions**
- **Schedule** — quick-add: name, type, date, location, link program + contacts. Saves as `planned`.
- **Mark done** — stamps completion; **cascade:** sets `last_contact=today` on every linked contact; optionally increments the linked program's `beneficiaries_reached` (prompt "how many reached?"); counts toward the mandal's `activities_done`.
- **Add outcome notes.**
- **Cancel** (status → cancelled).

**Status lifecycle:** `Planned → Done` or `Planned → Cancelled`.

**Cross-module:** Done activities drive the contact `last_contact` stamp, optional program progress, and the mandal `activities_done` in the leaderboard.

**Alerts:** upcoming (today/tomorrow); overdue (planned + past date → "mark done?").

---

## Module 5 — Team

**Pages:** **roster** (`/team`), **member detail**, add/edit, **allocation** view.

**Actions**
- **Add member**; set role, status, stipend, allocation.
- **Assign to programs.**
- **Assign tasks** (simple task list per member, with due date → feeds reminders).
- **Set status** (Prospect → Active → Inactive).

**Cross-module:** activities/programs per member power an optional team leaderboard.

**Alerts:** task due reminders.

---

## Dashboard (ties it together)

**Pages:** `/` — scope toggle (Constituency ↔ State) re-scopes everything.

**Panels (top to bottom):**
1. **Needs attention** — the notifications panel (due follow-ups, overdue activities, stale funding, due milestones).
2. **Mission scorecard** — funding raised vs target, beneficiaries reached, contacts in pool, activities this month, mandals/districts active.
3. **Coverage leaderboard** — ranks mandals (or districts) by `coverage_score` from the `mandal_coverage` view; lowest flagged as "focus here".
4. **Scoreboards** — funding by stage, impact per program, activity streak + trend, contact growth.
5. **Badges** — milestone thresholds: "All 7 mandals active", "First MoU", "First disbursement", "1,000 contacts", "10,000 beneficiaries".

---

## Schema additions (migration `0002_operations.sql`)

```sql
-- status / stage history (audit trail for all status changes)
create table status_history (
  id          uuid primary key default gen_random_uuid(),
  entity_type text not null,           -- 'funding' | 'program' | 'activity' | 'contact'
  entity_id   uuid not null,
  from_status text,
  to_status   text not null,
  changed_at  timestamptz not null default now(),
  changed_by  uuid references auth.users(id)
);
create index on status_history(entity_type, entity_id);

-- extra date columns
alter table funding  add column stage_changed_at timestamptz, add column disbursed_date date;
alter table programs add column status_changed_at timestamptz;
alter table activities add column completed_at timestamptz;

-- optional v1.5: notifications (otherwise compute alerts on the fly)
create table notifications (
  id         uuid primary key default gen_random_uuid(),
  type       text not null,
  severity   text not null default 'info',
  entity_type text,
  entity_id  uuid,
  message    text not null,
  read_at    timestamptz,
  created_at timestamptz not null default now()
);

-- simple team tasks
create table tasks (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  team_id     uuid references team(id) on delete cascade,
  program_id  uuid references programs(id) on delete set null,
  due_date    date,
  done        boolean not null default false,
  created_at  timestamptz not null default now()
);
```

Apply the same RLS pattern as `0001`: `status_history`, `notifications`, and `tasks` readable/writable by authenticated users; keep anything tied to contacts/funding owner-gated if it would leak sensitive data.

---

## Build order for these behaviors

Layer the operations onto each module **as you build that module** (per `AGENTS.md` milestones) — don't build a separate "operations" pass. The notifications panel and dashboard badges come together in Milestone 7, once the modules that feed them exist.
