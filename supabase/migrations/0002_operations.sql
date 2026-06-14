-- Mission 2028 — operational history, reminders, tasks, and transition dates
alter type activity_status add value if not exists 'cancelled';
create table status_history (id uuid primary key default gen_random_uuid(), entity_type text not null check (entity_type in ('funding','program','activity','contact')), entity_id uuid not null, from_status text, to_status text not null, changed_at timestamptz not null default now(), changed_by uuid references auth.users(id));
create index idx_status_history_entity on status_history(entity_type, entity_id);
alter table funding add column stage_changed_at timestamptz not null default now(), add column disbursed_date date;
alter table programs add column status_changed_at timestamptz not null default now();
alter table activities add column completed_at timestamptz;
create table notifications (id uuid primary key default gen_random_uuid(), type text not null, severity text not null default 'info' check (severity in ('info','medium','high','celebrate')), entity_type text, entity_id uuid, message text not null, read_at timestamptz, created_at timestamptz not null default now());
create index idx_notifications_unread on notifications(read_at, created_at desc);
create table tasks (id uuid primary key default gen_random_uuid(), title text not null, team_id uuid references team(id) on delete cascade, program_id uuid references programs(id) on delete set null, due_date date, done boolean not null default false, created_at timestamptz not null default now());
create index idx_tasks_due on tasks(due_date) where done = false;
create or replace function record_status_transition() returns trigger language plpgsql security definer set search_path = public as $$
declare old_value text; new_value text; status_field text := tg_argv[0];
begin old_value := to_jsonb(old)->>status_field; new_value := to_jsonb(new)->>status_field;
if old_value is distinct from new_value then insert into status_history(entity_type, entity_id, from_status, to_status, changed_by) values (tg_table_name, new.id, old_value, new_value, auth.uid()); end if; return new; end; $$;
create trigger funding_stage_history after update of stage on funding for each row when (old.stage is distinct from new.stage) execute function record_status_transition('stage');
create trigger program_status_history after update of status on programs for each row when (old.status is distinct from new.status) execute function record_status_transition('status');
create trigger activity_status_history after update of status on activities for each row when (old.status is distinct from new.status) execute function record_status_transition('status');
create or replace function stamp_funding_stage_change() returns trigger language plpgsql as $$ begin new.stage_changed_at := now(); return new; end; $$;
create trigger funding_stage_stamp before update of stage on funding for each row when (old.stage is distinct from new.stage) execute function stamp_funding_stage_change();
create or replace function stamp_program_status_change() returns trigger language plpgsql as $$ begin new.status_changed_at := now(); return new; end; $$;
create trigger program_status_stamp before update of status on programs for each row when (old.status is distinct from new.status) execute function stamp_program_status_change();
create or replace function complete_activity() returns trigger language plpgsql security definer set search_path = public as $$
begin if new.status = 'done' and old.status is distinct from new.status then new.completed_at := now(); update contacts set last_contact = current_date where id in (select contact_id from activity_contacts where activity_id = new.id); end if; return new; end; $$;
create trigger activity_completion before update of status on activities for each row execute function complete_activity();
alter table status_history enable row level security;
alter table notifications enable row level security;
alter table tasks enable row level security;
create policy status_history_rw on status_history for all to authenticated using (true) with check (true);
create policy notifications_rw on notifications for all to authenticated using (true) with check (true);
create policy tasks_rw on tasks for all to authenticated using (true) with check (true);
