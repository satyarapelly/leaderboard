# Local setup

The app has two local modes:

- **UI demo mode:** no Supabase required; Contact Pool operations are stored in browser `localStorage`.
- **Full local Supabase stack:** runs Postgres, Auth, Storage, and Studio in Docker and applies the repository migrations.

## Option A — run the UI demo immediately

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), then choose **Add contact** or **Contacts**. To reset the demo, remove `mission-2028-contacts` from browser DevTools → Application → Local Storage.

## Option B — install and run Supabase locally

### Prerequisites

1. Install **Docker Desktop** (macOS/Windows) or Docker Engine (Linux), then confirm it is running:

   ```bash
   docker version
   ```

2. Use Node.js 20 or newer:

   ```bash
   node --version
   ```

You do **not** need to globally install Supabase. The supported Node workflow runs the CLI through `npx`. Do not use `npm install -g supabase`.

### Start Supabase

From this repository:

```bash
npx supabase init       # only needed once; skip if supabase/config.toml already exists
npm run supabase:start
npm run supabase:reset  # applies 0001, 0002, then supabase/seed.sql
npm run supabase:status
```

`supabase start` downloads and starts the Docker containers. Its output includes the local API URL, anon key, service-role key, database URL, and Studio URL. Typical local URLs are:

- API: `http://127.0.0.1:54321`
- Studio: `http://127.0.0.1:54323`

### Connect the Next.js application

Create `.env.local` using the **API URL** and **anon key** printed by `npm run supabase:status`:

```bash
cat > .env.local <<'ENV'
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<copy the anon key from supabase status>
SUPABASE_SERVICE_ROLE_KEY=<copy the service_role key from supabase status>
ENV
```

Restart Next.js after changing environment variables:

```bash
npm run dev
```

> Important: the current Contact Pool UI intentionally uses `localStorage`, so it remains usable without authentication. The Supabase client is configured in `lib/supabase/client.ts`, and the database is ready, but replacing the local Contact Pool adapter with authenticated Supabase CRUD is still required before contact changes will appear in Studio.

### Useful commands

```bash
npm run supabase:status  # show local URLs and keys
npm run supabase:reset   # rebuild DB, apply migrations, and run seed
npm run supabase:stop    # stop local containers
npm run build            # production build check
```

## Connect to a hosted Supabase project instead

1. Create a project at [supabase.com](https://supabase.com).
2. Copy `.env.example` to `.env.local` and fill it with Project Settings → API values.
3. Link and push migrations:

   ```bash
   npx supabase login
   npx supabase link --project-ref <project-ref>
   npx supabase db push
   ```

   The project ref is the subdomain before `.supabase.co`. For example, for
   `https://iwzyujjncaztbnvklxbz.supabase.co`, run:

   ```bash
   npx supabase login
   npx supabase link --project-ref iwzyujjncaztbnvklxbz
   npx supabase db push
   ```

   `supabase link` may prompt for the database password created with the
   hosted project. This is not the anon key or service-role key.

Never expose `SUPABASE_SERVICE_ROLE_KEY` in browser code or commit `.env.local`.

## Where to put the direct PostgreSQL connection string

Put a hosted direct connection string in the root `.env.local` file as a
**server-only** variable:

```bash
DATABASE_URL="postgresql://postgres:YOUR_URL_ENCODED_PASSWORD@db.YOUR_PROJECT_REF.supabase.co:5432/postgres"
```

- Replace `YOUR_URL_ENCODED_PASSWORD` with the database password, not the
  literal `[YOUR-PASSWORD]` placeholder.
- URL-encode special password characters such as `@`, `:`, `/`, `#`, and `%`.
- Never name it `NEXT_PUBLIC_DATABASE_URL`; that would expose the database
  password to the browser.
- Never commit `.env.local`.
- This Next.js app currently uses `supabase-js`, so it does not consume
  `DATABASE_URL` at runtime. Keep it for trusted server-side tools, ORMs,
  `psql`, or migration commands.

The direct `db.<project-ref>.supabase.co:5432` endpoint requires IPv6 unless
the project has Supabase's IPv4 add-on. For serverless deployments or
IPv4-only networks, copy a Supavisor pooler connection from the project's
**Connect** panel instead.

To test the direct connection without exposing it in shell history:

```bash
set -a
source .env.local
set +a
psql "$DATABASE_URL"
```

## Troubleshooting `Cannot find project ref`

`npx supabase db push` only pushes to a hosted project after the local
repository has been linked. From Windows Command Prompt or PowerShell, run:

```powershell
cd C:\Users\v-srapelly\source\repos\leaderboard
npx supabase login
npx supabase link --project-ref iwzyujjncaztbnvklxbz
npx supabase db push
```

After linking, Supabase stores the selected project ref in the local
`supabase/.temp` directory. Do not commit that directory or credentials.

Useful checks:

```powershell
npx supabase projects list
npx supabase migration list
npx supabase db push --dry-run
```

If linking reports an authentication error, rerun `npx supabase login`. If it
reports a database authentication error, reset the database password from the
hosted project's database settings, then rerun `supabase link`.
