alter table courses add column if not exists body_id int references examining_bodies(id);
create or replace function has_role(names text[]) returns boolean language sql security definer stable set search_path=public as $$
  select exists(select 1 from profiles p join roles r on r.id=p.role_id where p.id=auth.uid() and r.name = any(names)) $$;
do $$ declare t text; begin
  foreach t in array array['examining_bodies','qualification_categories','courses','curriculum_versions','modules','units'] loop
    execute format('create policy "%1$s read" on %1$I for select to authenticated using (true)', t);
    execute format('create policy "%1$s manage" on %1$I for all to authenticated using (has_role(array[''super_admin'',''system_admin'',''content_admin''])) with check (has_role(array[''super_admin'',''system_admin'',''content_admin'']))', t);
  end loop; end $$;
