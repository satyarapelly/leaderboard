# Mission 2028 — Constituency Command Center

A field-ready web app to run a grassroots development + public-life mission in the **Sirpur Kaghaznagar** assembly constituency (Telangana, India) and across the wider **state**. It tracks people, funding, programs, activities, and team in one place — and surfaces progress as **leaderboards and scoreboards** so momentum across every mandal and district is visible at a glance.

This README is the build brief. Implement it incrementally per the milestones at the bottom.

---

## 1. Goal & philosophy

- **One operator now, small team later.** Build for a single owner first; design data + auth so a small team can be added with controlled access.
- **Field-first / handy.** Mobile is the primary surface. Capturing a contact must take seconds, one-handed, and work offline.
- **The contact pool is the heart.** Everything else (funding, programs, activities) links back to people and places.
- **Two geographic scopes.** Track at **constituency** level (7 mandals, fine-grained) and **state** level (districts). The UI toggles between them.
- **Leaderboards make progress legible.** Rank mandals/districts by a coverage score; show funding, reach, and activity as scoreboards with progress bars and streaks.
- **Owned & exportable.** All data exportable (CSV/JSON). No lock-in.

---

## 2. Recommended tech stack

Pick this stack unless there's a strong reason not to — it is fast to scaffold, low-cost, and deploys cleanly.

- **Framework:** Next.js (App Router) + TypeScript
- **UI:** Tailwind CSS + shadcn/ui components
- **Charts:** Recharts (leaderboards, progress, trends)
- **Backend + DB:** Supabase (PostgreSQL + Auth + Storage for photos + Row-Level Security)
- **Data fetching:** TanStack Query (with offline persistence)
- **PWA / offline:** installable PWA (manifest + service worker); cache reads in IndexedDB, queue writes when offline and sync on reconnect
- **Maps (optional, later):** simple SVG/Leaflet mandal map for coverage heat
- **Hosting:** Vercel (app) + Supabase (db/auth/storage)

All free-tier friendly.

---

## 3. Geographic model (first-class)

A hierarchical `locations` table drives both scopes:

```
State (Telangana)
 └─ District (e.g., Komaram Bheem Asifabad)
     └─ Assembly Constituency (Sirpur)
         └─ Mandal (7: Kouthala, Bejjur, Kagaznagar, Sirpur (T),
                       Dahegaon, Penchikalpet, Chintalamanepally)
             └─ Village
```

- Seed the 7 constituency mandals on first run.
- Every contact, activity, and program is geo-tagged to a location.
- A global **scope toggle** (Constituency ↔ State) re-scopes every dashboard and leaderboard.

---

## 4. Data model

Use UUID primary keys, `created_at`/`updated_at` timestamps, and soft-delete (`archived_at`) everywhere.

### `locations`
| field | type | notes |
|---|---|---|
| id | uuid | pk |
| name | text | |
| type | enum | state \| district \| constituency \| mandal \| village |
| parent_id | uuid | self-fk |

### `contacts`  (the Contact Pool — core entity)
| field | type | notes |
|---|---|---|
| id | uuid | pk |
| name | text | required |
| phone | text | required; drives call/WhatsApp |
| category | enum | official, political, elected_rep, community_leader, religious_leader, donor, corporate_csr, media, ngo, business_vendor, professional, educator, youth_volunteer, diaspora, beneficiary, friend |
| affiliation | text | org/department/party |
| designation | text | |
| location_id | uuid | fk → locations |
| how_met | text | the "association" memory hook |
| referred_by | uuid | self-fk (relationship web) |
| email | text | |
| photo_url | text | Supabase Storage |
| tags | text[] | csr_mover, donor_potential, can_mobilize, press_friendly, influential, volunteer… |
| influence | enum | high \| medium \| low |
| last_contact | date | stamped on each touch |
| next_action | text | active subset only |
| next_action_date | date | drives follow-up views |
| notes | text | |

### `funding`
| field | type | notes |
|---|---|---|
| id | uuid | pk |
| name | text | e.g. "SCCL – health van" |
| channel | enum | csr, psu, mp_lads, foreign, platform, govt_scheme |
| entity | enum | gfs, synergy, bannu_inc, bannu_arogyada |
| stage | enum | identified, drafting, submitted, in_discussion, mou, disbursed, declined |
| amount | numeric | |
| target | numeric | for progress bars |
| funder_contact_id | uuid | fk → contacts |
| program_id | uuid | fk → programs |
| next_action | text | |
| next_action_date | date | |

### `programs`
| field | type | notes |
|---|---|---|
| id | uuid | pk |
| name | text | health van, MHM, STEM labs, ILC… |
| theme | enum | health, education, empowerment |
| status | enum | planned, funded, running, paused, complete |
| location_id | uuid | fk → locations |
| scope | enum | constituency \| state |
| beneficiaries_target | int | |
| beneficiaries_reached | int | |
| team_lead_id | uuid | fk → team |
| next_milestone | text | |
| milestone_date | date | |

### `activities`
| field | type | notes |
|---|---|---|
| id | uuid | pk |
| name | text | |
| type | enum | visit, camp, meeting, event, travel |
| date | date | drives calendar |
| status | enum | planned \| done |
| program_id | uuid | fk → programs (nullable) |
| location_id | uuid | fk → locations |
| notes | text | outcomes |

### `team`
| field | type | notes |
|---|---|---|
| id | uuid | pk |
| name | text | |
| role | text | coordinator, volunteer, doctor… |
| status | enum | active, prospect, inactive |
| stipend | numeric | |
| allocation | text | |

### Join tables
- `activity_contacts` (activity_id, contact_id) — who you met at an activity; logging an activity stamps each contact's `last_contact`.

### `users`
- Supabase Auth. Role: `owner` | `team`. RLS: owner sees all; team sees Programs/Activities/Team but **not** Contacts or Funding unless granted.

---

## 5. Features by module

### Contact Pool (priority #1)
- **Fast capture:** a + button anywhere → modal with only Name, Phone, Category → save in one tap. Everything else optional, editable later.
- **Pre-visit lookup:** pick a village/mandal → list everyone known there with role, tags, last_contact, notes. (Critical field feature.)
- **Log a touch:** one tap stamps `last_contact` = today and (optionally) creates a linked activity.
- **One-tap actions:** call, WhatsApp (`https://wa.me/<phone>`), email from each contact.
- **Photo:** capture/upload a face photo.
- **Retrieval:** filter by category, location, tag, influence; full-text search on name/affiliation/notes; saved views (e.g., "CSR movers", "Press in constituency").
- **Going cold:** view of contacts whose last_contact > N days or next_action_date is overdue.
- **Offline:** capture and reads work offline; sync on reconnect.

### Funding Pipeline
- Kanban board by `stage`; drag cards to advance.
- Each card links to funder (contact) and program; shows entity + amount.
- Pipeline value rolled up by stage; raised vs target progress.
- "This week" view by `next_action_date`.

### Programs
- Cards by status; theme + mandal/scope; beneficiaries_reached vs target progress bar.
- Linked funding sources and team lead; next milestone.

### Activities & Events
- Calendar view (month/week) of all activities.
- Quick-add visit/camp/meeting; link to program + location + contacts.
- Mark done; capture outcome notes.

### Team
- Roster with role/status/allocation; link to programs; simple task list per member.

---

## 6. The leaderboard / command-center layer

This is the headline dashboard. It respects the global **Constituency ↔ State** scope toggle.

### Mission scorecard (top strip)
KPI cards with progress: total funding raised vs target, beneficiaries reached, contacts in pool, activities this month, mandals/districts active.

### Mandal Coverage Leaderboard (constituency scope)
Rank the 7 mandals by a **coverage score**, descending. Default formula (make weights configurable):

```
coverage_score(location) =
    contacts_count          * 1
  + activities_done_count   * 3
  + programs_running_count  * 5
  + beneficiaries_reached   * 0.1
```

Render as a ranked bar list with the score, the component breakdown, and a "gap" highlight on the lowest-ranked mandals (where to focus). When scope = State, rank **districts** by the same formula.

### Scoreboards (cards with charts)
- **Funding:** raised vs target (progress), pipeline value by stage (bar), by channel/entity (donut).
- **Program impact:** beneficiaries reached per program vs target.
- **Activity momentum:** activities per week (trend) + current **streak** (consecutive active weeks).
- **Contact growth:** pool size over time (line) + new contacts this week.
- **Team:** activities logged per team member (friendly leaderboard).

### Gamification
- Progress bars and percentages everywhere a target exists.
- **Milestone badges:** e.g., "All 7 mandals active", "First MoU", "1,000 contacts", "10,000 beneficiaries".
- **Streaks** for weekly activity and weekly follow-ups completed.

Keep it motivating but never vanity — every metric maps to a real mission goal.

---

## 7. Screens / routes

```
/                  Dashboard (scorecard + leaderboards + scope toggle)
/contacts          Pool: list, filters, search, fast-add
/contacts/[id]     Detail: info, touches, linked activities, actions
/visit             Pre-visit lookup (pick location → who I know there)
/funding           Pipeline kanban
/programs          Program cards
/activities        Calendar + list
/team              Roster
/map               Mandal coverage map (later)
/settings          Locations, targets, weights, export, team access
```

Bottom nav on mobile: Dashboard · Contacts · + (capture) · Funding · More.

---

## 8. Non-functional requirements

- **Mobile-first PWA**, installable, works offline (read + queued writes), syncs on reconnect.
- **Capture ≤ 10 s**; retrieval in a few taps.
- **RLS-enforced access**; Contacts + Funding private to owner by default.
- **Export** any table to CSV/JSON.
- **Performant** to ~10k contacts; paginate + index `location_id`, `category`, `next_action_date`, GIN index on `tags`.
- **i18n-ready** (English first; Telugu labels a plus).

---

## 9. Acceptance criteria (definition of done for v1)

- [ ] Can add a contact in one tap with Name + Phone + Category, offline, and it syncs later.
- [ ] Pre-visit lookup returns everyone tagged to a chosen mandal/village.
- [ ] One-tap WhatsApp/call/email works from a contact.
- [ ] Funding kanban advances stages and rolls up pipeline value + raised-vs-target.
- [ ] Dashboard shows the mission scorecard and the Mandal Coverage Leaderboard, and re-scopes when toggled to State.
- [ ] Activities appear on a calendar and link to contacts + program.
- [ ] "Going cold" and "This week" follow-up views work off `next_action_date`/`last_contact`.
- [ ] Owner vs team access enforced via RLS.
- [ ] Any table exports to CSV.

---

## 10. Build milestones (sequence for the agent)

1. **Scaffold:** Next.js + TS + Tailwind + shadcn; Supabase project; PWA manifest + service worker; auth (owner).
2. **Schema + seed:** create tables, RLS, seed the state→constituency→7 mandals hierarchy.
3. **Contact Pool:** list, fast-add, detail, touches, filters/search, pre-visit lookup, offline cache. *(Ship this first — it's the core.)*
4. **Activities + calendar:** linked to contacts/programs; "this week" + "going cold" views.
5. **Funding pipeline:** kanban, rollups, links.
6. **Programs + Team:** cards, links, beneficiaries tracking.
7. **Dashboard + leaderboards:** scorecard, mandal/district coverage leaderboard, scoreboards, badges/streaks, scope toggle.
8. **Polish:** export, settings (targets/weights/team access), map view, i18n.

Ship each milestone deployable. Don't wait for the whole thing.

---

## 11. Out of scope (for now)
- Financial accounting/audit (handled externally by a CA — track status, not bookkeeping).
- Public-facing donation pages (use existing platforms).
- Native iOS/Android apps (PWA covers field use).

## 12. Setup expectations
- Provide `.env.example` (Supabase URL/keys).
- `README` run steps: `npm install`, `npm run dev`, Supabase migration command, seed script.
- Keep migrations in `/supabase/migrations`; seed in `/supabase/seed.sql`.
- Commit in milestone-sized PRs with a short demo note each.
