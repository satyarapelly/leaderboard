-- Connected field intelligence and daily execution planning
alter table contacts
  add column if not exists livelihood text,
  add column if not exists education text,
  add column if not exists community_group text,
  add column if not exists religion text,
  add column if not exists social_interest boolean not null default false;

alter table tasks
  add column if not exists scheduled_date date,
  add column if not exists start_time time,
  add column if not exists end_time time,
  add column if not exists priority text not null default 'medium' check (priority in ('low','medium','high')),
  add column if not exists category text not null default 'field',
  add column if not exists notes text,
  add column if not exists contact_id uuid references contacts(id) on delete set null,
  add column if not exists location_id uuid references locations(id) on delete set null,
  add column if not exists updated_at timestamptz not null default now();
create index if not exists idx_tasks_schedule on tasks(scheduled_date, start_time);
create trigger t_tasks_upd before update on tasks for each row execute function extensions.moddatetime(updated_at);

alter publication supabase_realtime add table contacts;
alter publication supabase_realtime add table tasks;
