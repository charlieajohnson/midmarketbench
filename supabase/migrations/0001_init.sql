create extension if not exists pgcrypto;

create table public.providers (
  id text primary key,
  name text not null,
  slug text not null unique,
  website text not null,
  created_at timestamptz not null default now()
);

create table public.models (
  id text primary key,
  provider_id text not null references public.providers(id),
  slug text not null unique,
  name text not null,
  version text not null,
  release_month date,
  context_window text,
  open_weights boolean not null default false,
  source_url text not null,
  created_at timestamptz not null default now()
);

create table public.benchmark_versions (
  id uuid primary key default gen_random_uuid(),
  label text not null unique,
  released_at date not null,
  methodology_notes text not null,
  created_at timestamptz not null default now()
);

create table public.dimensions (
  key text primary key,
  label text not null,
  short_label text not null,
  weight numeric(5,4) not null check (weight > 0 and weight <= 1),
  description text not null,
  high_descriptor text not null,
  low_descriptor text not null
);

create table public.cases (
  id text primary key,
  slug text not null unique,
  name text not null,
  sector text not null,
  subsector text not null,
  geography text not null,
  company_stage text not null,
  arr_eur_m numeric(12,2),
  growth_rate numeric(8,4),
  ebitda_margin numeric(8,4),
  ownership_context text,
  difficulty text not null check (difficulty in ('low', 'medium', 'high')),
  confidentiality text not null default 'synthetic' check (confidentiality = 'synthetic'),
  skills text[] not null default '{}',
  summary text not null,
  is_public boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.case_files (
  id uuid primary key default gen_random_uuid(),
  case_id text not null references public.cases(id) on delete cascade,
  filename text not null,
  file_type text not null,
  description text not null,
  inline_data jsonb,
  unique (case_id, filename)
);

create table public.tasks (
  key text primary key,
  name text not null,
  prompt text not null,
  expected_output jsonb not null,
  what_good_looks_like jsonb not null,
  failure_modes jsonb not null
);

create table public.case_tasks (
  case_id text not null references public.cases(id) on delete cascade,
  task_key text not null references public.tasks(key) on delete cascade,
  primary key (case_id, task_key)
);

create table public.answer_key_items (
  id text primary key,
  case_id text not null references public.cases(id) on delete cascade,
  issue text not null,
  evidence jsonb not null,
  why_it_matters text not null,
  high_score_response text not null,
  low_score_response text not null,
  is_public boolean not null default false
);

create table public.runs (
  id uuid primary key default gen_random_uuid(),
  benchmark_version_id uuid not null references public.benchmark_versions(id),
  model_id text not null references public.models(id),
  case_id text not null references public.cases(id),
  task_key text not null references public.tasks(key),
  mode text not null check (mode in ('closed_book', 'web_enabled', 'agentic', 'human_in_the_loop')),
  prompt_hash text not null,
  raw_output_path text,
  latency_ms integer,
  input_tokens integer,
  output_tokens integer,
  created_at timestamptz not null default now(),
  unique (benchmark_version_id, model_id, case_id, task_key, mode, prompt_hash)
);

create table public.scores (
  id uuid primary key default gen_random_uuid(),
  run_id uuid not null references public.runs(id) on delete cascade,
  dimension_key text not null references public.dimensions(key),
  value numeric(5,2) not null check (value >= 0 and value <= 100),
  evaluator_type text not null check (evaluator_type in ('deterministic', 'model_judge', 'human')),
  evaluator_id text,
  rationale text,
  created_at timestamptz not null default now(),
  unique (run_id, dimension_key, evaluator_type, evaluator_id)
);

create table public.sample_outputs (
  id uuid primary key default gen_random_uuid(),
  run_id uuid references public.runs(id),
  model_id text not null references public.models(id),
  case_id text not null references public.cases(id),
  task_key text not null references public.tasks(key),
  content text not null,
  dimension_scores jsonb not null,
  evaluator_rationale text not null,
  quality text not null check (quality in ('strong', 'weak')),
  is_public boolean not null default true
);

create index runs_lookup_idx on public.runs (benchmark_version_id, model_id, case_id, task_key);
create index scores_run_idx on public.scores (run_id);
create index case_files_case_idx on public.case_files (case_id);

alter table public.providers enable row level security;
alter table public.models enable row level security;
alter table public.benchmark_versions enable row level security;
alter table public.dimensions enable row level security;
alter table public.cases enable row level security;
alter table public.case_files enable row level security;
alter table public.tasks enable row level security;
alter table public.case_tasks enable row level security;
alter table public.answer_key_items enable row level security;
alter table public.runs enable row level security;
alter table public.scores enable row level security;
alter table public.sample_outputs enable row level security;

create policy "public read providers" on public.providers for select using (true);
create policy "public read models" on public.models for select using (true);
create policy "public read versions" on public.benchmark_versions for select using (true);
create policy "public read dimensions" on public.dimensions for select using (true);
create policy "public read public cases" on public.cases for select using (is_public);
create policy "public read public case files" on public.case_files for select using (exists (select 1 from public.cases c where c.id = case_id and c.is_public));
create policy "public read tasks" on public.tasks for select using (true);
create policy "public read public case tasks" on public.case_tasks for select using (exists (select 1 from public.cases c where c.id = case_id and c.is_public));
create policy "public read disclosed answer keys" on public.answer_key_items for select using (is_public);
create policy "public read runs" on public.runs for select using (exists (select 1 from public.cases c where c.id = case_id and c.is_public));
create policy "public read scores" on public.scores for select using (exists (select 1 from public.runs r join public.cases c on c.id = r.case_id where r.id = run_id and c.is_public));
create policy "public read samples" on public.sample_outputs for select using (is_public);

-- No public write policies. Service-role writes belong in the private evaluation runner.
