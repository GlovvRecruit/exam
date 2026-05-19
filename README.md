# Glovv Manager 시험 (v3 - 4종 시험)

응시자 10명 내외용 시험 웹앱. **무료 인프라**(Supabase + GitHub Pages)로 돌아갑니다.

## 시험 구성 (4종, 각 100점 만점, 30분)

| # | 시험 | 분량 | 형식 | 채점 |
|---|---|---|---|---|
| 1 | **온보딩** | 50문항 | 서술식 통문장 암기 | 자동 (키워드) + 수동 가산점 |
| 2 | **세일즈 스크립트** | 22문항 | 서술식 통문장 암기 | 자동 (키워드) + 수동 가산점 |
| 3 | **피드백 미팅** | 13문항 | 서술식 통문장 암기 | 자동 (키워드) + 수동 가산점 |
| 4 | **메타 광고 노하우** | 객10·단10·서5·스토리1 | 종합 평가 | 자동(객/단) + 수동(서/스토리) |

응시자는 4종 중 원하는 시험을 골라 응시. 같은 이름·같은 날·같은 시험은 한 번만 가능 (다른 시험은 별도 응시 가능).

## 셋업 가이드 (한 번만)

### 1. Supabase 프로젝트 만들기 (무료)

1. https://supabase.com 가입 → **New Project** 클릭
2. Project name 아무거나, DB 비밀번호도 적당히, Region은 Tokyo 또는 Seoul
3. 프로젝트 생성 완료까지 1~2분 대기

### 2. DB 스키마 만들기

1. Supabase 대시보드 → 왼쪽 메뉴 **SQL Editor**
2. `schema.sql` 파일 전체 복사해서 붙여넣기
3. **Run** 클릭

> 이미 v1/v2 스키마로 데이터가 있다면 schema.sql 하단의 마이그레이션 주석을 풀고 실행하세요.

### 3. API 키 복사

1. 대시보드 → **Project Settings** → **API**
2. **Project URL** (`https://xxxx.supabase.co`)
3. **Project API keys** 중 `anon public` 키

### 4. config.js 채우기

```js
const SUPABASE_URL = "https://xxxx.supabase.co";  // 위에서 복사
const SUPABASE_ANON_KEY = "eyJ...";               // anon public 키
const EXAM_DURATION_MIN = 60;                     // 시험 시간(분)
```

### 5. 어드민 계정 생성 (Supabase Auth)

채점자(어드민)는 Supabase Auth 이메일 로그인을 사용합니다.

1. Supabase 대시보드 → **Authentication** → **Users** → **Add user** → **Create new user**
2. 어드민 이메일과 비밀번호 입력 → **Create user**
3. **Authentication** → **Providers** → **Email** 설정에서 **Confirm email** 옵션 확인
   - 켜져 있으면 위에서 입력한 이메일의 confirmation 메일을 클릭해야 로그인 가능
   - 소수 인원 운영이면 꺼두는 게 편함

### 6. RLS 정책 적용

응시자(anon)와 어드민(authenticated)의 권한을 분리합니다.

1. Supabase 대시보드 → **SQL Editor**
2. `rls-admin-auth.sql` 파일 전체 복사해서 붙여넣기
3. **Run** 클릭

> 응시자가 본인 점수(essay_score 등)를 임의로 조작하지 못하게 차단하면서, 어드민은 모든 row를 채점·조회할 수 있게 합니다. 자세한 동작과 알려진 한계는 `rls-admin-auth.sql` 상단 코멘트 참고.

### 7. GitHub Pages 배포

1. 새 GitHub repository 생성 (Public, 이름은 아무거나)
2. 이 폴더의 파일 전부 업로드
3. Repo → **Settings** → **Pages** → Source: **Deploy from a branch**, Branch: **main** → **Save**
4. 2~3분 후 `https://<유저명>.github.io/<repo명>/` 으로 접속 가능

## 응시자에게 알려줄 것

응시자에게 메인 페이지 URL 하나만 보내면 됩니다:

```
https://<유저명>.github.io/<repo명>/
```

응시자는 메인에서 시험을 골라 → 이름 입력 → 응시 → 제출 합니다.

## 채점

`https://<유저명>.github.io/<repo명>/admin.html` 접속해서 **Supabase 어드민 이메일 + 비밀번호**로 로그인하면:

- 응시자 목록 (시험별 필터링 가능)
- 메타광고는 객관식·단답형 자동 채점 + 서술형·스토리라인 수동 채점
- 온보딩/세일즈/피드백은 키워드 자동 채점 + 수동 가산/감점 (말이 되는지·문장 구조 평가용)

## 파일 구조

```
index.html              ← 메인: 4종 시험 선택 화면
exam-onboarding.html    ← 1번 시험 페이지 (서술식 암기 템플릿)
exam-sales.html         ← 2번 시험 페이지
exam-feedback.html      ← 3번 시험 페이지
exam-meta-ads.html      ← 4번 시험 페이지 (객·단·서·스토리)

exam-data-onboarding.js ← 1번 문제 데이터 + 자동 채점 로직
exam-data-sales.js      ← 2번 문제 데이터
exam-data-feedback.js   ← 3번 문제 데이터
exam-data-meta-ads.js   ← 4번 문제 데이터 (MCQ/SHORT/ESSAY/STORYLINE)

admin.html              ← 채점 어드민 (4종 모두 대응, 시험별 필터, Supabase Auth 로그인)
config.js               ← Supabase URL / anon key / 시험 시간 (어드민 비번은 Supabase Auth로 대체)
schema.sql              ← Supabase DB 테이블 생성 SQL (초기 1회)
rls-admin-auth.sql      ← admin auth용 RLS 정책 (admin.html 배포 후 수동 적용)
```

## 자동 채점 방식 (1~3번 시험)

각 문항마다 키워드 그룹이 정의되어 있습니다 (예: q1에 8개 그룹).
- 그룹 내부는 OR 매칭 (`["감사", "감사합니다"]` 둘 중 하나만 있어도 OK)
- 그룹 간은 AND (전체 8개 중 몇 개가 매칭됐는지로 비율 계산)
- 비율에 따라 부분 점수:
  - **60%↑**: 만점
  - **50~60%**: 80% 점수
  - **40~50%**: 60% 점수
  - **30~40%**: 30% 점수
  - **30% 미만**: 0점

수동 가산/감점은 admin에서 "말이 되는지·문장 구조"를 보고 ±점수 입력하면 합산됩니다.

## 자동 저장 / 시간 종료

- 응시자가 답안을 작성할 때마다 1.5초 디바운스로 자동 저장됨 (네트워크 끊겨도 답안 안 날아감)
- 30분 타이머 종료 시 자동 제출
- 새로고침 또는 창 닫을 때 경고 (작성한 답안은 자동 저장되어 있음)

## 비용

전부 무료 플랜으로 충분합니다.
- Supabase 무료 플랜: 500MB DB / 무제한 API 요청
- GitHub Pages: 무료
- 응시자 10명, 4종 시험 = 40개 레코드 정도 → 한참 남음
