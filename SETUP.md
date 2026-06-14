# Local quick start

## Run the interactive demo (no backend required)

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), then choose **Add contact** or **Contacts**. Contact add, search, call/WhatsApp links, log-touch, and archive actions work immediately. Demo contacts are persisted in your browser's `localStorage`, so Supabase is not required to try the workflow.

To reset demo data, open browser DevTools → Application → Local Storage and remove `mission-2028-contacts`.

## Connect Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. Copy `.env.example` to `.env.local` and fill in the URL and keys.
3. Run migrations in order, then the seed:
   - `supabase/migrations/0001_init.sql`
   - `supabase/migrations/0002_operations.sql`
   - `supabase/seed.sql`
4. After signing up, make your user an owner:

```sql
update profiles set role='owner' where id = '<your-auth-uid>';
```

The current contact demo intentionally uses local storage; the Supabase schema is ready for replacing that adapter when authentication is added.

## Production check

```bash
npm run build
npm start
```
