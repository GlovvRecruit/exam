-- ===========================================================================
-- 정답 자료(답안지 원문) 저장소 — admin.html 「정답 자료 관리」 화면용
-- ===========================================================================
-- 적용: Supabase Dashboard → SQL Editor → 이 파일 전체 붙여넣기 → Run (1회, 재실행 안전)
-- 전제: rls-admin-auth.sql 적용 완료 (어드민 = authenticated)
--
-- 구성:
--   1) exam_references 테이블 — 슬롯(온보딩1/온보딩2/세일즈1/세일즈2)별 파일명 + 추출 텍스트
--   2) Storage 비공개 버킷 exam-references — 원본 PDF 보관 (교체 시 덮어쓰기)
-- 응시자(anon)는 둘 다 접근 불가. 원문에 내부 계정 정보가 있을 수 있으므로 비공개 유지.
-- ===========================================================================

create table if not exists exam_references (
  slot         text primary key,          -- 'onboarding-1' / 'onboarding-2' / 'sales-1' / 'sales-2'
  exam_type    text not null,             -- 'onboarding' / 'sales'
  area         text not null,             -- 'all' / 'phone' / 'meeting'
  title        text not null,
  file_name    text,
  storage_path text,
  content      text default '',
  updated_at   timestamptz not null default now()
);

alter table exam_references enable row level security;

drop policy if exists "authenticated manage references" on exam_references;
create policy "authenticated manage references"
  on exam_references for all
  to authenticated
  using (true)
  with check (true);

revoke all on exam_references from anon;
grant select, insert, update, delete on exam_references to authenticated;

-- Storage 버킷 (비공개, 파일당 50MB)
insert into storage.buckets (id, name, public, file_size_limit)
values ('exam-references', 'exam-references', false, 52428800)
on conflict (id) do nothing;

drop policy if exists "authenticated read exam-references" on storage.objects;
drop policy if exists "authenticated insert exam-references" on storage.objects;
drop policy if exists "authenticated update exam-references" on storage.objects;
drop policy if exists "authenticated delete exam-references" on storage.objects;

create policy "authenticated read exam-references"
  on storage.objects for select to authenticated
  using (bucket_id = 'exam-references');
create policy "authenticated insert exam-references"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'exam-references');
create policy "authenticated update exam-references"
  on storage.objects for update to authenticated
  using (bucket_id = 'exam-references')
  with check (bucket_id = 'exam-references');
create policy "authenticated delete exam-references"
  on storage.objects for delete to authenticated
  using (bucket_id = 'exam-references');
