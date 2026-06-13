# Bootstrap — quick start

## 1. Install
```bash
npm install
```

## 2. Supabase
1. Create a project at supabase.com.
2. Copy `.env.example` to `.env.local` and fill in the URL + keys.
3. Run the schema and seed (SQL editor, or the CLI):
   - `supabase/migrations/0001_init.sql`  (tables, RLS, leaderboard view)
   - `supabase/seed.sql`                  (Telangana → Sirpur → 7 mandals)
4. Make yourself owner: after signing up once, run
   `update profiles set role='owner' where id = '<your-auth-uid>';`

## 3. Run
```bash
npm run dev
```
Open http://localhost:3000 — the dashboard reads the `mandal_coverage` leaderboard view.

## 4. Build order
Follow the milestones in `README.md` (§10). Start with the Contact Pool.
