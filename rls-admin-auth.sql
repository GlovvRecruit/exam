-- ===========================================================================
-- ⚠️  중요: 이 SQL을 적용하기 전 README.md의 "어드민 셋업" 섹션을 꼭 읽으세요.
-- ===========================================================================
-- 적용 순서:
--   1. Supabase Dashboard → Authentication → Users 에서 어드민 계정 생성
--      (Authentication → Providers → Email → "Confirm email" 옵션도 확인)
--   2. admin.html 배포 (Supabase Auth 로그인 화면 포함된 최신 버전)
--   3. 이 SQL을 Supabase SQL Editor에 붙여넣고 Run
--   4. 어드민 이메일로 로그인 시도해서 정상 동작 확인
--   5. anon 키만 가진 시크릿 창에서 응시 페이지 → 시험 시작·제출 정상 동작 확인
-- ===========================================================================
-- 이 파일은 schema.sql의 기존 RLS 정책을 어드민 인증 모델로 교체합니다.
--
-- 핵심 변경:
--   - 어드민 권한이 클라이언트측 평문 비밀번호 → Supabase Auth 세션으로 이동
--   - 응시자(anon)는 답안·제출 관련 컬럼만 수정 가능
--   - 어드민이 채점하는 컬럼(essay_score / storyline_score / essay_grading /
--     storyline_grading / graded_at)은 anon으로부터 차단 (가산점 조작 방지)
--   - 어드민(authenticated)은 모든 컬럼·모든 row 접근 가능
--
-- ⚠️ 알려진 보안 한계:
--   응시자(anon)는 auto_score 컬럼을 여전히 쓸 수 있습니다. 이는 exam-*.html이
--   클라이언트측에서 키워드 매칭으로 자동 채점한 결과를 제출 시 함께 쓰는 구조
--   이기 때문입니다. 이 컬럼을 막으면 시험 제출이 깨집니다.
--
--   완전 차단을 원하면 추가로 필요한 작업:
--     a) exam-*.html에서 auto_score 전송 제거
--     b) admin.html이 attempt 로드 시 essay_answers/mcq_answers를 보고
--        autoGradeMemorization / gradeMCQ 를 재실행해 점수 재계산 후 저장
--     또는
--     c) Postgres 트리거나 Edge Function으로 서버측 자동 채점 구현
--
--   현 시점에서는 응시자가 신뢰 가능한 내부 후보(10명 내외)임을 전제로
--   auto_score 클라이언트 계산을 허용합니다. essay_score 등 admin 채점 점수는
--   본 정책으로 차단되므로 가산점 조작은 막힙니다.
-- ===========================================================================

-- ===========================================================================
-- 0. 기존 정책 제거 (멱등성 확보 — 두 번 실행해도 안전)
-- ===========================================================================

-- schema.sql에 있던 정책
drop policy if exists "anyone can insert attempt" on exam_attempts;
drop policy if exists "anyone can update unsubmitted" on exam_attempts;
drop policy if exists "anyone can select" on exam_attempts;

-- 이 파일에서 새로 만드는 정책 (재실행 대비)
drop policy if exists "anon can insert" on exam_attempts;
drop policy if exists "anon can update unsubmitted" on exam_attempts;
drop policy if exists "anon can select" on exam_attempts;
drop policy if exists "authenticated full insert" on exam_attempts;
drop policy if exists "authenticated full update" on exam_attempts;
drop policy if exists "authenticated full select" on exam_attempts;
drop policy if exists "authenticated full delete" on exam_attempts;

-- RLS 활성화 (이미 켜져있어도 무해)
alter table exam_attempts enable row level security;

-- ===========================================================================
-- 1. 응시자(anon) 정책 — 시험 시작·답안 저장·제출은 가능, 점수 조작은 불가
-- ===========================================================================

-- INSERT: 누구나 새 응시 기록 생성 가능 (시험 시작 시)
create policy "anon can insert"
  on exam_attempts for insert
  to anon
  with check (true);

-- UPDATE: submitted_at IS NULL 인 경우(=제출 전)만 허용. 제출 후 자동 잠김.
create policy "anon can update unsubmitted"
  on exam_attempts for update
  to anon
  using (submitted_at is null)
  with check (true);

-- SELECT: exam-*.html이 .insert(...).select().single() 로 새 row id를 받아오는
--         구조라 anon SELECT가 필요. anon 키는 어차피 클라에 노출되므로
--         새로운 위험을 만들지 않음.
create policy "anon can select"
  on exam_attempts for select
  to anon
  using (true);

-- 컬럼 레벨: anon이 UPDATE 가능한 컬럼 화이트리스트
-- 차단되는 컬럼: essay_score, storyline_score, essay_grading,
--               storyline_grading, graded_at (= 어드민 채점 결과)
revoke update on exam_attempts from anon;
grant update (
  mcq_answers,
  short_answers,
  essay_answers,
  storyline_answer,
  submitted_at,
  auto_score,
  essay_status,
  storyline_status
) on exam_attempts to anon;

-- ===========================================================================
-- 2. 어드민(authenticated) 정책 — 모든 권한
-- ===========================================================================

create policy "authenticated full insert"
  on exam_attempts for insert
  to authenticated
  with check (true);

create policy "authenticated full update"
  on exam_attempts for update
  to authenticated
  using (true)
  with check (true);

create policy "authenticated full select"
  on exam_attempts for select
  to authenticated
  using (true);

create policy "authenticated full delete"
  on exam_attempts for delete
  to authenticated
  using (true);

-- 어드민은 모든 컬럼에 대해 표 레벨 권한 보장
grant select, insert, update, delete on exam_attempts to authenticated;

-- ===========================================================================
-- 3. 검증 쿼리 (적용 후 SQL Editor에서 실행해 확인)
-- ===========================================================================
-- 활성 정책 확인:
--   select policyname, cmd, roles from pg_policies
--   where tablename = 'exam_attempts'
--   order by cmd, policyname;
--
-- 컬럼 권한 확인 (anon 화이트리스트가 의도대로 적용됐는지):
--   select grantee, privilege_type, column_name
--   from information_schema.column_privileges
--   where table_name = 'exam_attempts'
--     and grantee in ('anon', 'authenticated')
--     and privilege_type = 'UPDATE'
--   order by grantee, column_name;
--
-- 기대 결과: anon에는 mcq_answers/short_answers/essay_answers/storyline_answer/
--          submitted_at/auto_score/essay_status/storyline_status 만 보여야 함.
--          essay_score, storyline_score 등은 anon에 없어야 함.
