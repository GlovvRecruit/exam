-- ========================================
-- 인턴 시험 - Supabase 스키마 (v3)
-- 4종 시험 (온보딩 / 세일즈 스크립트 / 피드백 미팅 / 메타 광고 노하우)
-- ========================================
-- Supabase 프로젝트 만들기 → SQL Editor → 이 파일 전체 붙여넣기 → Run
-- ========================================

-- 1. 응시 기록 테이블
create table if not exists exam_attempts (
  id uuid primary key default gen_random_uuid(),
  name text not null,

  -- 시험 종류: 'onboarding' / 'sales' / 'feedback' / 'meta-ads'
  exam_type text not null default 'meta-ads',

  exam_date date not null default current_date,
  started_at timestamptz not null default now(),
  submitted_at timestamptz,

  -- 답안 (JSON으로 저장)
  mcq_answers jsonb default '{}'::jsonb,
  short_answers jsonb default '{}'::jsonb,
  essay_answers jsonb default '{}'::jsonb,
  storyline_answer text default '',

  -- 자동 채점 점수
  auto_score int default 0,
  -- 수동 채점 점수
  essay_score int default 0,
  storyline_score int default 0,
  -- 최종 점수
  total_score int generated always as (auto_score + essay_score + storyline_score) stored,

  -- 채점 상태
  essay_status text default 'pending',
  essay_grading jsonb default '{}'::jsonb,
  storyline_status text default 'pending',
  storyline_grading jsonb default '{}'::jsonb,
  graded_at timestamptz,

  -- 같은 이름·같은 날·같은 시험 중복 응시 방지 (4종 다 응시 가능)
  unique (name, exam_date, exam_type)
);

-- 인덱스
create index if not exists idx_exam_date on exam_attempts (exam_date desc);
create index if not exists idx_exam_type on exam_attempts (exam_type);
create index if not exists idx_total_score on exam_attempts (total_score desc);

-- ========================================
-- 2. RLS 정책
-- ========================================

alter table exam_attempts enable row level security;

drop policy if exists "anyone can insert attempt" on exam_attempts;
create policy "anyone can insert attempt"
  on exam_attempts for insert
  to anon
  with check (true);

drop policy if exists "anyone can update unsubmitted" on exam_attempts;
create policy "anyone can update unsubmitted"
  on exam_attempts for update
  to anon
  using (submitted_at is null)
  with check (true);

drop policy if exists "anyone can select" on exam_attempts;
create policy "anyone can select"
  on exam_attempts for select
  to anon
  using (true);

-- ========================================
-- v1/v2 → v3 마이그레이션 (기존 데이터가 있다면 아래 주석 풀고 실행)
-- ========================================
-- alter table exam_attempts add column if not exists exam_type text not null default 'meta-ads';
-- alter table exam_attempts drop constraint if exists exam_attempts_name_exam_date_key;
-- alter table exam_attempts add constraint exam_attempts_name_exam_date_exam_type_key unique (name, exam_date, exam_type);
-- create index if not exists idx_exam_type on exam_attempts (exam_type);
