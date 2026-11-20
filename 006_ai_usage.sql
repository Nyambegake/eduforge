create table ai_usage(id bigserial primary key, user_id uuid default auth.uid(), task text, created_at timestamptz default now());
alter table ai_usage enable row level security;
create policy "own ai usage insert" on ai_usage for insert to authenticated with check (user_id=auth.uid());
create policy "own ai usage read" on ai_usage for select to authenticated using (user_id=auth.uid());
create index on ai_usage(user_id, created_at);
