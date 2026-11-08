-- 에이전트 포트폴리오 스키마. 여러 번 적용해도 기존 데이터를 지우지 않는다.
create table if not exists public.media_assets (
  id uuid primary key default gen_random_uuid(),
  object_path text not null unique,
  thumb_path text,
  original_name text,
  mime_type text,
  size_bytes bigint,
  width integer,
  height integer,
  created_at timestamptz not null default now()
);

create table if not exists public.agents (
  id bigint generated always as identity primary key,
  name text not null,
  age integer,
  nationality text,
  occupation text,
  role text,
  height_cm integer,
  bust_cm integer,
  waist_cm integer,
  hip_cm integer,
  shoe_size text,
  turnaround_asset_id uuid references public.media_assets(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.agent_photos (
  id bigint generated always as identity primary key,
  agent_id bigint not null references public.agents(id) on delete cascade,
  asset_id uuid not null references public.media_assets(id),
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists agent_photos_agent_idx on public.agent_photos(agent_id, sort_order, id);
