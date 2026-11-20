alter table profiles add column if not exists country text default 'Kenya', add column if not exists institution text,
  add column if not exists education_level text, add column if not exists created_at timestamptz default now(),
  add column if not exists status text not null default 'active' check (status in ('active','pending','suspended'));
-- Only active accounts count as holding a role.
create or replace function has_role(names text[]) returns boolean language sql security definer stable set search_path=public as $$
  select exists(select 1 from profiles p join roles r on r.id=p.role_id where p.id=auth.uid() and p.status='active' and r.name = any(names)) $$;
-- Public sign-up may only pick these roles. Institution admins wait for approval.
create or replace function handle_new_user() returns trigger language plpgsql security definer set search_path=public as $$
declare r text := coalesce(new.raw_user_meta_data->>'role','learner'); st text := 'active';
begin
  if r not in ('learner','teacher','tvet_trainer','institution_admin') then r := 'learner'; end if;
  if r = 'institution_admin' then st := 'pending'; end if;
  insert into profiles(id, full_name, role_id, country, institution, education_level, status)
  select new.id, left(new.raw_user_meta_data->>'full_name',120), id, left(coalesce(new.raw_user_meta_data->>'country','Kenya'),80),
         left(new.raw_user_meta_data->>'institution',160), left(new.raw_user_meta_data->>'education_level',80), st from roles where name=r;
  return new; end $$;
create policy "admins read all profiles" on profiles for select to authenticated using (has_role(array['super_admin','system_admin']));
-- Users edit only safe fields, through this function (there is no direct update policy).
create or replace function update_my_profile(p_name text, p_country text, p_institution text, p_level text) returns void language sql security definer set search_path=public as $$
  update profiles set full_name=left(p_name,120), country=left(p_country,80), institution=left(p_institution,160), education_level=left(p_level,80) where id=auth.uid() $$;
create or replace function admin_set_role(target uuid, role_name text) returns void language plpgsql security definer set search_path=public as $$
declare me text;
begin
  select r.name into me from profiles p join roles r on r.id=p.role_id where p.id=auth.uid() and p.status='active';
  if coalesce(me,'') not in ('super_admin','system_admin') then raise exception 'not allowed'; end if;
  if role_name='super_admin' and me<>'super_admin' then raise exception 'only a super administrator can grant this role'; end if;
  update profiles set role_id=(select id from roles where name=role_name) where id=target; end $$;
create or replace function admin_set_status(target uuid, new_status text) returns void language plpgsql security definer set search_path=public as $$
begin
  if not has_role(array['super_admin','system_admin']) then raise exception 'not allowed'; end if;
  if new_status not in ('active','pending','suspended') then raise exception 'bad status'; end if;
  update profiles set status=new_status where id=target; end $$;
revoke all on function update_my_profile(text,text,text,text), admin_set_role(uuid,text), admin_set_status(uuid,text) from public, anon;
grant execute on function update_my_profile(text,text,text,text), admin_set_role(uuid,text), admin_set_status(uuid,text) to authenticated;
-- Approve an institution admin (run as an administrator, or call admin_set_status from the app):
-- select admin_set_status('<user uuid>', 'active');
