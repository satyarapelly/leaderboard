-- Mission 2028 — initial schema, RLS, and leaderboard view
-- PostgreSQL / Supabase (PG15+)

create extension if not exists moddatetime schema extensions;
-- ---------- enums ----------
create type location_type    as enum ('state','district','constituency','mandal','village');
create type contact_category as enum ('official','political','elected_rep','community_leader','religious_leader','donor','corporate_csr','media','ngo','business_vendor','professional','educator','youth_volunteer','diaspora','beneficiary','friend');
create type influence_level  as enum ('high','medium','low');
create type funding_channel  as enum ('csr','psu','mp_lads','foreign','platform','govt_scheme');
create type funding_entity   as enum ('gfs','synergy','bannu_inc','bannu_arogyada');
create type funding_stage    as enum ('identified','drafting','submitted','in_discussion','mou','disbursed','declined');
create type program_theme    as enum ('health','education','empowerment');
create type program_status   as enum ('planned','funded','running','paused','complete');
create type program_scope    as enum ('constituency','state');
create type activity_type    as enum ('visit','camp','meeting','event','travel');
create type activity_status  as enum ('planned','done');
create type team_status      as enum ('active','prospect','inactive');
create type app_role         as enum ('owner','team');
-- ---------- profiles (role) ----------
create table profiles (
  id         uuid primary key references auth.users on delete cascade,
  full_name  text,
  role       app_role not null default 'team',
  created_at timestamptz not null default now()
);
create or replace function is_owner() returns boolean
language sql security definer stable set search_path = public as $$
  select exists (select 1 from profiles where id = auth.uid() and role = 'owner');
$$;
-- auto-create a profile on signup
create or replace function handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into profiles (id, full_name) values (new.id, new.raw_user_meta_data->>'full_name')
  on conflict (id) do nothing;
  return new;
end;
$$;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function handle_new_user();
-- ---------- locations ----------
create table locations (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  type       location_type not null,
  parent_id  uuid references locations(id) on delete set null,
  created_at timestamptz not null default now()
);
-- ---------- team ----------
create table team (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  role       text,
  status     team_status not null default 'prospect',
  stipend    numeric default 0,
  allocation text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  archived_at timestamptz
);
-- ---------- programs ----------
create table programs (
  id                   uuid primary key default gen_random_uuid(),
  name                 text not null,
  theme                program_theme,
  status               program_status not null default 'planned',
  location_id          uuid references locations(id) on delete set null,
  scope                program_scope not null default 'constituency',
  beneficiaries_target int default 0,
  beneficiaries_reached int default 0,
  team_lead_id         uuid references team(id) on delete set null,
  next_milestone       text,
  milestone_date       date,
  notes                text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  archived_at timestamptz
);
-- ---------- contacts ----------
create table contacts (
  id               uuid primary key default gen_random_uuid(),
  name             text not null,
  phone            text not null,
  category         contact_category not null,
  affiliation      text,
  designation      text,
  location_id      uuid references locations(id) on delete set null,
  how_met          text,
  referred_by      uuid references contacts(id) on delete set null,
  email            text,
  photo_url        text,
  tags             text[] not null default '{}',
  influence        influence_level,
  last_contact     date,
  next_action      text,
  next_action_date date,
  notes            text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  archived_at timestamptz
);
-- ---------- funding ----------
create table funding (
  id                uuid primary key default gen_random_uuid(),
  name              text not null,
  channel           funding_channel,
  entity            funding_entity,
  stage             funding_stage not null default 'identified',
  amount            numeric default 0,
  target            numeric default 0,
  funder_contact_id uuid references contacts(id) on delete set null,
  program_id        uuid references programs(id) on delete set null,
  next_action       text,
  next_action_date  date,
  notes             text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  archived_at timestamptz
);
-- ---------- activities ----------
create table activities (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  type        activity_type not null,
  date        date not null default current_date,
  status      activity_status not null default 'planned',
  program_id  uuid references programs(id) on delete set null,
  location_id uuid references locations(id) on delete set null,
  notes       text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  archived_at timestamptz
);
create table activity_contacts (
  activity_id uuid references activities(id) on delete cascade,
  contact_id  uuid references contacts(id) on delete cascade,
  primary key (activity_id, contact_id)
);
-- ---------- indexes ----------
create index idx_contacts_location on contacts(location_id);
create index idx_contacts_category on contacts(category);
create index idx_contacts_next_action on contacts(next_action_date);
create index idx_contacts_tags on contacts using gin(tags);
create index idx_activities_date on activities(date);
create index idx_activities_location on activities(location_id);
create index idx_funding_stage on funding(stage);
create index idx_programs_status on programs(status);
create index idx_programs_location on programs(location_id);
-- ---------- updated_at triggers ----------
create trigger t_team_upd      before update on team      for each row execute function extensions.moddatetime(updated_at);
create trigger t_programs_upd   before update on programs   for each row execute function extensions.moddatetime(updated_at);
create trigger t_contacts_upd   before update on contacts   for each row execute function extensions.moddatetime(updated_at);
create trigger t_funding_upd    before update on funding    for each row execute function extensions.moddatetime(updated_at);
create trigger t_activities_upd before update on activities for each row execute function extensions.moddatetime(updated_at);
-- ---------- leaderboard view ----------
create view mandal_coverage with (security_invoker = true) as
select
  l.id   as location_id,
  l.name as mandal,
  l.type as level,
  coalesce(c.cnt, 0)   as contacts,
  coalesce(a.cnt, 0)   as activities_done,
  coalesce(p.running, 0) as programs_running,
  coalesce(p.benef, 0) as beneficiaries_reached,
  ( coalesce(c.cnt,0) * 1
  + coalesce(a.cnt,0) * 3
  + coalesce(p.running,0) * 5
  + coalesce(p.benef,0) * 0.1 ) as coverage_score
from locations l
left join ( select location_id, count(*) cnt from contacts where archived_at is null group by location_id ) c on c.location_id = l.id
left join ( select location_id, count(*) cnt from activities where status='done' and archived_at is null group by location_id ) a on a.location_id = l.id
left join ( select location_id, count(*) filter (where status='running') running, sum(beneficiaries_reached) benef from programs where archived_at is null group by location_id ) p on p.location_id = l.id
where l.type in ('mandal','district');
-- ---------- RLS ----------
alter table profiles          enable row level security;
alter table locations         enable row level security;
alter table team              enable row level security;
alter table programs          enable row level security;
alter table contacts          enable row level security;
alter table funding           enable row level security;
alter table activities        enable row level security;
alter table activity_contacts enable row level security;
-- profiles: read own or owner; update own
create policy profiles_read on profiles for select using (id = auth.uid() or is_owner());
create policy profiles_upd  on profiles for update using (id = auth.uid());
-- locations: all authenticated read; owner writes
create policy loc_read on locations for select to authenticated using (true);
create policy loc_write on locations for all to authenticated using (is_owner()) with check (is_owner());
-- contacts + funding: OWNER ONLY (sensitive)
create policy contacts_owner on contacts for all to authenticated using (is_owner()) with check (is_owner());
create policy funding_owner  on funding  for all to authenticated using (is_owner()) with check (is_owner());
-- programs / activities / team / join: any authenticated team member
create policy programs_rw   on programs          for all to authenticated using (true) with check (true);
create policy activities_rw on activities        for all to authenticated using (true) with check (true);
create policy team_rw       on team              for all to authenticated using (true) with check (true);
create policy actcon_rw     on activity_contacts for all to authenticated using (true) with check (true);
