-- Ofício Brasil — schema Supabase
-- Acesso sempre via service_role (backend Express). RLS desativado nas tabelas.

create extension if not exists "pgcrypto";

create table if not exists students (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  cpf char(11) not null unique,
  data_nascimento date not null,
  email text not null unique,
  senha_hash text not null,
  ativo boolean not null default true,
  criado_em timestamptz not null default now()
);

create table if not exists admins (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  email text not null unique,
  senha_hash text not null,
  criado_em timestamptz not null default now()
);

create table if not exists courses (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  professor text not null default '',
  descricao text not null default '',
  categoria text not null default '',
  preco numeric(10,2) not null default 0,
  thumbnail text,
  duracao_total text not null default '',
  criado_em timestamptz not null default now()
);

create table if not exists lessons (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references courses(id) on delete cascade,
  ordem integer not null default 0,
  titulo text not null,
  duracao text not null default '',
  video_url text not null default '',
  descricao text not null default '',
  material_complementar text not null default ''
);
create index if not exists lessons_course_idx on lessons(course_id, ordem);

create table if not exists enrollments (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references students(id) on delete cascade,
  course_id uuid not null references courses(id) on delete cascade,
  comprado_em timestamptz not null default now(),
  unique (student_id, course_id)
);

create table if not exists lesson_progress (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references students(id) on delete cascade,
  lesson_id uuid not null references lessons(id) on delete cascade,
  concluida_em timestamptz not null default now(),
  unique (student_id, lesson_id)
);

create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references students(id) on delete cascade,
  course_id uuid not null references courses(id) on delete cascade,
  nota integer not null check (nota between 1 and 5),
  comentario text not null default '',
  criado_em timestamptz not null default now(),
  unique (student_id, course_id)
);

-- RLS desativado (acesso só via service_role pelo backend)
alter table students       disable row level security;
alter table admins         disable row level security;
alter table courses        disable row level security;
alter table lessons        disable row level security;
alter table enrollments    disable row level security;
alter table lesson_progress disable row level security;
alter table reviews        disable row level security;
