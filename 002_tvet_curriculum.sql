-- Qualification category and numeric level are separate fields, per the specification.
create table qualification_categories(id serial primary key, name text unique not null); -- Artisan, Craft, Certificate, Diploma...
alter table courses add column category_id int references qualification_categories(id);
alter table courses add column level_number int;
alter table courses add column duration text, add column entry_requirements text;
create table modules(id uuid primary key default gen_random_uuid(), curriculum_version_id uuid references curriculum_versions(id), position int, title text not null);
alter table units add column module_id uuid references modules(id), add column learning_outcomes jsonb default '[]', add column performance_criteria jsonb default '[]';
create table topics(id uuid primary key default gen_random_uuid(), unit_id uuid references units(id), session text, title text not null);
alter table curriculum_versions add column superseded_by uuid references curriculum_versions(id);
-- A resource can relate to several units.
create table resource_units(resource_id uuid references resources(id) on delete cascade, unit_id uuid references units(id), topic_id uuid references topics(id), primary key(resource_id,unit_id));
alter table resources add column resource_type text, add column access_level text default 'restricted', add column approved_by uuid references profiles(id), add column original_filename text;
alter table resources enable row level security;
create policy "approved resources are readable" on resources for select using (status='approved' and access_level in ('public','free'));
create index on resource_units(unit_id); create index on modules(curriculum_version_id);
