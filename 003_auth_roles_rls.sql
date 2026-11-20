-- Roles, automatic profile creation, and row-level security on every table.
insert into roles(name) values ('super_admin'),('system_admin'),('content_admin'),('teacher'),('tvet_trainer'),('learner'),('institution_admin'),('guest') on conflict do nothing;
do $$ declare t text; begin
  for t in select tablename from pg_tables where schemaname='public' loop
    execute format('alter table %I enable row level security', t); end loop; end $$;
create policy "roles readable" on roles for select to authenticated using (true);
create policy "read own profile" on profiles for select to authenticated using (auth.uid()=id);
-- No update policy on profiles: users cannot change their own role.
create or replace function handle_new_user() returns trigger language plpgsql security definer set search_path=public as $$
declare r text := coalesce(new.raw_user_meta_data->>'role','learner');
begin
  if r not in ('learner','teacher','tvet_trainer') then r := 'learner'; end if;
  insert into profiles(id, full_name, role_id) select new.id, new.raw_user_meta_data->>'full_name', id from roles where name=r;
  return new; end $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function handle_new_user();
-- Make yourself Super Administrator after registering (run once, replace the email):
-- update profiles set role_id=(select id from roles where name='super_admin') where id=(select id from auth.users where email='YOU@example.com');
