-- 008: admin user management. Run after 001-007.
-- Lists users with their email (auth.users is not readable from the browser, so this runs as a guarded function).
create or replace function admin_list_users(p_search text default '', p_status text default '')
returns table(id uuid, email text, full_name text, role text, country text, institution text, education_level text, status text, created_at timestamptz, email_confirmed boolean)
language plpgsql security definer stable set search_path=public as $$
begin
  if not has_role(array['super_admin','system_admin']) then raise exception 'not allowed'; end if;
  return query
    select p.id, u.email::text, p.full_name, r.name, p.country, p.institution, p.education_level, p.status, p.created_at, (u.email_confirmed_at is not null)
    from profiles p join auth.users u on u.id=p.id left join roles r on r.id=p.role_id
    where (p_status='' or p.status=p_status)
      and (p_search='' or p.full_name ilike '%'||p_search||'%' or u.email ilike '%'||p_search||'%' or p.institution ilike '%'||p_search||'%')
    order by p.created_at desc limit 200;
end $$;

-- Safer role/status changes: nobody edits their own account here (prevents locking yourself out),
-- and a system administrator cannot touch a super administrator.
create or replace function admin_set_role(target uuid, role_name text) returns void language plpgsql security definer set search_path=public as $$
declare me text; theirs text;
begin
  select r.name into me from profiles p join roles r on r.id=p.role_id where p.id=auth.uid() and p.status='active';
  if coalesce(me,'') not in ('super_admin','system_admin') then raise exception 'not allowed'; end if;
  if target = auth.uid() then raise exception 'you cannot change your own role'; end if;
  select r.name into theirs from profiles p join roles r on r.id=p.role_id where p.id=target;
  if me<>'super_admin' and (role_name='super_admin' or theirs='super_admin') then raise exception 'only a super administrator can do this'; end if;
  if not exists(select 1 from roles where name=role_name) then raise exception 'unknown role'; end if;
  update profiles set role_id=(select id from roles where name=role_name) where id=target; end $$;

create or replace function admin_set_status(target uuid, new_status text) returns void language plpgsql security definer set search_path=public as $$
declare me text; theirs text;
begin
  select r.name into me from profiles p join roles r on r.id=p.role_id where p.id=auth.uid() and p.status='active';
  if coalesce(me,'') not in ('super_admin','system_admin') then raise exception 'not allowed'; end if;
  if new_status not in ('active','pending','suspended') then raise exception 'bad status'; end if;
  if target = auth.uid() then raise exception 'you cannot change your own status'; end if;
  select r.name into theirs from profiles p join roles r on r.id=p.role_id where p.id=target;
  if me<>'super_admin' and theirs='super_admin' then raise exception 'only a super administrator can do this'; end if;
  update profiles set status=new_status where id=target; end $$;

revoke all on function admin_list_users(text,text), admin_set_role(uuid,text), admin_set_status(uuid,text) from public, anon;
grant execute on function admin_list_users(text,text), admin_set_role(uuid,text), admin_set_status(uuid,text) to authenticated;
