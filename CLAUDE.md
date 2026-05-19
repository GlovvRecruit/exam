# CLAUDE.md

이 파일은 Claude Code가 이 프로젝트에서 작업할 때 참고하는 컨텍스트 문서입니다.

## 프로젝트 개요

**Glovv 인턴 시험 웹앱 (v3)** — 인턴 응시자 10명 내외용 온라인 시험 시스템.

- **스택**: 순수 HTML/CSS/JS (프레임워크 없음) + Supabase (DB) + GitHub Pages (호스팅)
- **UI 언어**: 한국어
- **응시자 흐름**: `index.html`(시험 선택) → `exam-*.html`(이름 입력 후 응시) → 자동 제출
- **채점자 흐름**: `admin.html` → 비번 입력 → 응시자 목록·자동채점 결과 확인 → 수동 가산점 입력
- **중복 응시 방지**: `(name, exam_date, exam_type)` UNIQUE 제약. 같은 사람이 다른 시험은 응시 가능.

## 시험 4종 구성 (각 100점 만점)

| 시험 | exam_type | 분량 | 시간 | 채점 방식 |
|---|---|---|---|---|
| 온보딩 | `onboarding` | 서술식 50문항 | **90분** | 키워드 자동 + 수동 가산점 |
| 세일즈 스크립트 | `sales` | 서술식 22문항 | **90분** | 키워드 자동 + 수동 가산점 |
| 피드백 미팅 | `feedback` | 서술식 13문항 | **30분** | 키워드 자동 + 수동 가산점 |
| 메타 광고 노하우 | `meta-ads` | 객관식 10 + 단답 10 + 서술 5 + 스토리라인 1 | **90분** | 객·단 자동 + 서·스토리 수동 |

> 주의: `exam-feedback.html`만 30분이고 나머지 3종은 90분. 문항 수가 적어서 의도된 차이로 보이지만, 일괄 변경 작업 시 빼먹기 쉬움.

## 파일 구조

```
index.html                ← 시험 선택 메인
exam-onboarding.html      ← 온보딩 응시 페이지
exam-sales.html           ← 세일즈 응시 페이지
exam-feedback.html        ← 피드백 응시 페이지
exam-meta-ads.html        ← 메타광고 응시 페이지 (객·단·서·스토리)

exam-data-onboarding.js   ← 온보딩 문제·정답·키워드 + autoGradeMemorization()
exam-data-sales.js        ← 세일즈 문제 데이터
exam-data-feedback.js     ← 피드백 문제 데이터
exam-data-meta-ads.js     ← 메타광고 문제 데이터 (MCQ/SHORT/ESSAY/STORYLINE)

admin.html                ← 채점 어드민 (4종 모두 대응, 시험별 필터)
config.js                 ← Supabase URL/Key, ADMIN_PASSWORD
schema.sql                ← Supabase 테이블/RLS 생성 SQL
README.md                 ← 셋업 가이드 (응시자 안내용 아님)
```

데이터 파일은 IIFE로 감싸 `window.examDataOnboarding` 등으로 노출됨. 각 `exam-*.html`은 `<script src="exam-data-*.js">` 다음 인라인 스크립트에서 `_data = window.examDataXxx`로 받아 씀.

## DB 스키마 핵심

테이블 1개: `exam_attempts`. 답안은 jsonb 컬럼에 저장.

- `mcq_answers`, `short_answers`, `essay_answers` (jsonb) / `storyline_answer` (text)
- `auto_score` (자동) + `essay_score` + `storyline_score` (수동) = `total_score` (generated 컬럼)
- `essay_status`, `storyline_status`: `'pending'` → 채점 후 변경
- RLS: anon이 insert/select 가능, update는 `submitted_at IS NULL`일 때만 (제출 후 잠김)

## 자주 수정하는 부분

### 1. 시험 시간 변경
각 `exam-*.html`의 인라인 `<script>` 상단에 **파일마다 따로** 선언됨:
```js
const EXAM_DURATION = 90;  // 분 단위, 0이면 시간 제한 없음
```
- `exam-onboarding.html:200`, `exam-sales.html:200`, `exam-feedback.html:200`, `exam-meta-ads.html:224`
- ⚠️ `config.js`의 `EXAM_DURATION_MIN`은 **사용되지 않음** (legacy). 여기 고쳐도 반영 안 됨.
- ⚠️ `exam-onboarding.html` 등에 `<b id="exam-duration-display">60분</b>` 같은 하드코딩 텍스트가 있지만 JS가 로드되면서 실제 값으로 덮어쓰므로 무시해도 됨.

### 2. 문제 추가/수정
- 객·단·서 문제: `exam-data-*.js`의 배열(`ESSAY_QUESTIONS`, `MCQ`, `SHORT`, `ESSAY` 등) 수정
- 서술식 키워드 채점: 문항의 `keywords: [[그룹1], [그룹2], ...]` 배열
  - 그룹 내부 = OR (동의어 묶음), 그룹 간 = AND
  - 매칭 비율 → 점수: 90%↑ 만점 / 70~90% 80% / 50~70% 60% / 30~50% 30% / 30%↓ 0점
- `points` 필드로 문항 배점 조정 (합계 100 유지)

### 3. 어드민 비번 / Supabase 키
`config.js` 한 파일에 다 있음:
```js
const SUPABASE_URL = "...";
const SUPABASE_ANON_KEY = "...";
const ADMIN_PASSWORD = "...";
```

### 4. 새 시험 종류 추가 시 체크리스트
1. `exam-data-신규.js` 작성 (`window.examData신규`로 노출)
2. `exam-신규.html` 작성 — 기존 파일 복사 후 `EXAM_TYPE`, `EXAM_DURATION`, `_data` 참조만 교체
3. `index.html`에 카드 추가
4. `admin.html`의 시험별 필터·렌더링에 `exam_type` 분기 추가
5. `schema.sql`의 `exam_type` 코멘트 갱신 (DB는 free-form text라 변경 불필요)

## 알아두면 좋은 동작

- **자동 저장**: 답안 입력 시 1.5초 디바운스로 Supabase update. 새로고침해도 답 안 날아감.
- **타이머 종료**: 시간 다 되면 자동 제출 (`submitted_at` 채워짐 → 이후 update 불가).
- **창 닫기 경고**: `beforeunload`로 막지만 답안은 이미 자동저장돼 있음.
- **무료 인프라**: Supabase free tier (500MB / 무제한 API), GitHub Pages. 응시자 10명 × 4종 = 40 row 수준.

## 작업 시 유의사항

- 응시 페이지 로직(`exam-*.html`의 인라인 `<script>`)은 4파일이 거의 동일한 구조라 한 곳 고치면 나머지도 함께 봐야 함.
- README.md는 약간 stale함 (시험 시간 30분으로 적혀있는 부분 등). 코드가 source of truth.
- 한국어 UI라 변수명·문자열에 한글 다수 포함. 인코딩 UTF-8 유지.
