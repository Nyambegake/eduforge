-- Core schema foundation. Run in the Supabase SQL editor.
create table roles(id serial primary key, name text unique not null);
create table institutions(id uuid primary key default gen_random_uuid(), name text not null);
create table profiles(id uuid primary key, full_name text, role_id int references roles(id), institution_id uuid references institutions(id));
create table departments(id serial primary key, slug text unique not null, name text not null);
create table examining_bodies(id serial primary key, name text unique not null);
create table qualification_levels(id serial primary key, body_id int references examining_bodies(id), name text not null);
create table courses(id serial primary key, department_id int references departments(id), level_id int references qualification_levels(id), name text not null);
create table curriculum_versions(id uuid primary key default gen_random_uuid(), course_id int references courses(id), version text not null, approved boolean default false, source_path text);
create table units(id uuid primary key default gen_random_uuid(), curriculum_version_id uuid references curriculum_versions(id), code text, title text not null);
create table resources(id uuid primary key default gen_random_uuid(), title text not null, original_path text not null, sha256 text unique, status text default 'pending', uploaded_by uuid references profiles(id));
create table resource_classifications(resource_id uuid references resources(id), unit_id uuid references units(id), curriculum_version_id uuid references curriculum_versions(id), confidence numeric, reviewed boolean default false, primary key(resource_id,unit_id));
create table audit_logs(id bigserial primary key, actor uuid, action text, created_at timestamptz default now());
create index on resources(status); create index on units(curriculum_version_id);
