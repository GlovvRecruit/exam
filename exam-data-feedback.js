// IIFE로 감싸 글로벌 충돌 방지. window.examDataFeedback 으로 접근.
(function() {
// ===========================================
// 피드백 미팅 시험 데이터 (서술식 암기)
// ===========================================
// 자료: 실제 ROAS 기반으로 보는 기획/가이드라인 작성법 (슬래시페이지)
// ===========================================

const EXAM_TITLE = "피드백 미팅 - 암기 시험";
const EXAM_SUBTITLE = "실제 ROAS 기반 기획/가이드라인 작성법";

const ESSAY_QUESTIONS = [
  // ========== 1. 첫 3초의 중요성 ==========
  {
    id: "q1",
    section: "1. 동일 브랜드 내 같은 제품 영상 비교",
    title: "첫 3초의 중요성",
    question: "동일 브랜드 / 같은 제품 영상에서 ROAS 200%와 80%를 가르는 핵심 요소는 무엇이며, 그 한 줄 결론을 작성하시오.",
    points: 5,
    keywords: [
      ["첫 3초", "3초"],
      ["중요성", "중요"],
      ["roas", "ROAS"],
      ["200"],
      ["이상", "미만"],
      ["갈린다", "갈"],
    ],
    answer_text: "첫 3초의 중요성 — 첫 3초로 ROAS 200% 이상과 미만이 갈린다.",
  },
  {
    id: "q2",
    section: "1. 동일 브랜드 내 같은 제품 영상 비교",
    title: "후킹의 정의 + 3가지 방법",
    question: "후킹(첫 3초)의 정의와 후킹의 3가지 방법을 모두 작성하시오.",
    points: 10,
    keywords: [
      ["후킹"],
      ["타겟"],
      ["공감"],
      ["이끌어내", "이끌"],
      ["겪고 있는 문제", "겪고", "문제"],
      ["날카롭게", "날카"],
      ["지적"],
      ["워너비", "워너비 모습", "모습"],
      ["보여줌", "보여"],
      ["통념"],
      ["비판"],
    ],
    answer_text: "후킹: 타겟의 공감을 이끌어내야 함. (1) 타겟이 겪고 있는 문제를 날카롭게 지적함, (2) 타겟의 워너비 모습을 보여줌, (3) 타겟이 갖고 있는 통념을 비판함.",
  },

  // ========== 2. 2차 가공 ==========
  {
    id: "q3",
    section: "2. 2차 가공해 ROAS 잘나오는 영상",
    title: "2차 가공의 중요성 - 사용 시점",
    question: "2차 가공이 어느 단계에서 활발히 이용되어야 하는지 작성하시오.",
    points: 4,
    keywords: [
      ["고객 니즈 검증", "니즈 검증"],
      ["단계"],
      ["테스팅"],
      ["2차 가공", "2차가공"],
      ["활발히", "활발"],
      ["이용"],
    ],
    answer_text: "고객 니즈 검증 단계(=테스팅 단계)에서는 2차 가공을 활발히 이용해야 한다.",
  },
  {
    id: "q4",
    section: "2. 2차 가공해 ROAS 잘나오는 영상",
    title: "2차 가공으로 변경할 수 있는 것 5가지",
    question: "2차 가공으로 변경할 수 있는 것 5가지를 모두 작성하시오.",
    points: 10,
    keywords: [
      ["첫 3초", "3초"],
      ["후킹"],
      ["내용"],
      ["속도감", "속도"],
      ["usp", "USP"],
      ["순서"],
      ["불필요"],
      ["부분"],
      ["제거"],
      ["원리"],
      ["실험"],
      ["참고", "참고 자료"],
      ["추가"],
    ],
    answer_text: "2차 가공으로 변경할 수 있는 것: (1) 첫 3초 후킹 내용 (2) 속도감 (3) USP 순서 (4) 불필요한 부분 제거 (5) 원리 및 실험 참고 자료 추가 등",
  },
  {
    id: "q5",
    section: "2. 2차 가공해 ROAS 잘나오는 영상",
    title: "2차 가공으로 변경할 수 없는 것 3가지",
    question: "2차 가공으로 변경할 수 없는 것 3가지를 모두 작성하시오.",
    points: 8,
    keywords: [
      ["전반적", "전반"],
      ["스토리 라인", "스토리라인", "스토리"],
      ["인플루언서"],
      ["이미지"],
      ["파트너십 광고", "파트너십"],
      ["게시물"],
      ["수정"],
    ],
    answer_text: "2차 가공으로 변경할 수 없는 것: (1) 전반적인 스토리 라인 (2) 인플루언서 이미지 (3) 파트너십 광고용 게시물 수정",
  },

  // ========== 3. 파트너십 광고 ==========
  {
    id: "q6",
    section: "3. 파트너십 광고로 ROAS 잘나오는 영상",
    title: "파트너십 광고 도입 시점",
    question: "파트너십 광고를 통한 ROAS 끌어올리기를 언제 시작해야 하는지, 그리고 어떤 형태의 캠페인을 오픈해야 하는지 작성하시오.",
    points: 8,
    keywords: [
      ["어느정도", "어느 정도"],
      ["고객 니즈 검증", "니즈 검증"],
      ["완료"],
      ["파트너십 광고", "파트너십"],
      ["대형 캠페인", "대형"],
      ["10명 이상", "10명"],
      ["모집"],
      ["오픈"],
    ],
    answer_text: "어느정도 고객 니즈 검증이 완료되면, 파트너십 광고를 위해 대형 캠페인(=10명 이상 모집) 오픈.",
  },
  {
    id: "q7",
    section: "3. 파트너십 광고로 ROAS 잘나오는 영상",
    title: "메타 공식 발표 - 파트너십 광고의 효율",
    question: "메타 공식 발표 내용 2가지를 작성하시오. (같은 영상 비교 효율 / 여러 인플루언서 동시 진행 효율)",
    points: 10,
    keywords: [
      ["메타 공식 발표", "메타 공식", "공식 발표"],
      ["같은 영상", "같은"],
      ["파트너십 광고", "파트너십"],
      ["무조건"],
      ["효율"],
      ["여러 인플루언서", "여러"],
      ["인플루언서"],
      ["동시 다발", "동시"],
      ["진행"],
    ],
    answer_text: "메타 공식 발표: (1) 같은 영상이면 파트너십 광고가 무조건 효율↑ (2) 파트너십 광고는 여러 인플루언서 동시 다발적으로 진행할 때 효율↑",
  },

  // ========== 4. 최고의 ROAS 영상들 - 기획 핵심 ==========
  {
    id: "q8",
    section: "4. 최고의 ROAS 영상들 - 핵심",
    title: "★★★ 기획 및 가이드라인 작성 시 핵심 ★★★",
    question: "기획 및 가이드라인 작성 시 핵심 2가지를 작성하시오. (영상 1개 = 가치 1개 / USP는 3개 이하)",
    points: 12,
    keywords: [
      ["영상 1개", "1개의 영상", "1영상"],
      ["1개의 가치", "1개", "1가지 가치"],
      ["가치"],
      ["전달"],
      ["usp", "USP"],
      ["관련된"],
      ["3개 이하", "3개"],
      ["담기", "담"],
    ],
    answer_text: "기획 및 가이드라인 작성 시 핵심: (1) 영상 1개는 1개의 가치만 전달하기 (2) USP는 전달하고자 하는 1개 가치와 관련된 내용으로 3개 이하로 담기",
  },

  // ========== 추가 팁 ==========
  {
    id: "q9",
    section: "4. 추가 팁",
    title: "추가 팁 1. 타겟 좁히기",
    question: "추가 팁 1번을 작성하시오.",
    points: 5,
    keywords: [
      ["같은 문제", "문제"],
      ["겪고 있는", "겪"],
      ["사람"],
      ["타겟"],
      ["좁히기", "좁"],
    ],
    answer_text: "같은 문제를 겪고 있는 사람들로 타겟 좁히기",
  },
  {
    id: "q10",
    section: "4. 추가 팁",
    title: "추가 팁 2. 가이드라인 작성 원칙",
    question: "추가 팁 2번을 작성하시오. (심플하게 + 강조 내용 우선순위)",
    points: 8,
    keywords: [
      ["가이드라인"],
      ["작성"],
      ["심플", "심플하게"],
      ["강조"],
      ["내용"],
      ["우선순위"],
    ],
    answer_text: "가이드라인 작성은 심플하게 + 강조할 내용에 대한 우선순위 작성",
  },
  {
    id: "q11",
    section: "4. 추가 팁",
    title: "추가 팁 3. 캠페인 1개당 선정 인원",
    question: "추가 팁 3번을 작성하시오.",
    points: 5,
    keywords: [
      ["캠페인"],
      ["1개", "1개당"],
      ["5명 이상", "5명"],
      ["선정"],
    ],
    answer_text: "캠페인 1개당 5명 이상 선정",
  },

  // ========== 통합 응용 문항 ==========
  {
    id: "q12",
    section: "통합 응용",
    title: "ROAS가 안 나오는 영상 진단 → 2차 가공 안 제시",
    question: "ROAS 80% 영상을 받아본 브랜드에게 '왜 안 나오는지' 진단하고, '2차 가공으로 어떻게 개선할 수 있는지' 안내하는 멘트를 작성하시오. (첫 3초 후킹 부재 진단 + 변경 가능 항목 활용)",
    points: 8,
    keywords: [
      ["첫 3초", "3초"],
      ["후킹"],
      ["타겟"],
      ["공감"],
      ["roas", "ROAS"],
      ["2차 가공", "2차가공"],
      ["후킹 내용", "후킹"],
      ["속도감", "속도"],
      ["usp", "USP"],
      ["순서"],
    ],
    answer_text: "첫 3초의 후킹이 타겟의 공감을 이끌어내지 못하면 ROAS가 갈립니다. 2차 가공으로 첫 3초 후킹 내용을 다시 잡고, 속도감과 USP 순서를 조정한 뒤 불필요한 부분을 제거해서 다시 테스팅해보시는 것을 권장드립니다.",
  },
  {
    id: "q13",
    section: "통합 응용",
    title: "1영상 1가치 위반 진단 → 영상 분리 제안",
    question: "한 영상에 여러 효능(여드름·모공·미백·보습)을 다 담은 브랜드에게 무엇이 문제인지 진단하고, 어떤 방향으로 가이드라인을 다시 잡아야 하는지 안내하는 멘트를 작성하시오.",
    points: 7,
    keywords: [
      ["1개의 가치", "1개", "1영상 1가치", "1가치"],
      ["전달"],
      ["가이드라인"],
      ["심플", "심플하게"],
      ["usp", "USP"],
      ["3개 이하", "3개"],
      ["관련된"],
      ["우선순위", "순위"],
    ],
    answer_text: "영상 1개는 1개의 가치만 전달해야 합니다. 가이드라인을 심플하게 잡고, USP는 그 1개 가치와 관련된 내용으로 3개 이하만 담아주세요. 강조할 내용의 우선순위를 정해서, 핵심 효능 하나에 집중한 영상을 따로따로 만드는 방향이 ROAS에 효과적입니다.",
  },
];

// ===========================================
// 자동 채점 함수
// ===========================================
function normalize(s) {
  return (s || "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[,!?;:'"()\[\]·]/g, " ")
    .trim();
}

function gradeEssayAnswer(userAnswer, item) {
  const ans = normalize(userAnswer);
  if (!ans || ans.length < 10) return 0;
  const groups = item.keywords || [];
  if (groups.length === 0) return 0;
  let passed = 0;
  for (const group of groups) {
    if (group.some(kw => ans.includes(normalize(kw)))) {
      passed++;
    }
  }
  const ratio = passed / groups.length;
  if (ratio >= 0.6) return item.points;
  if (ratio >= 0.5) return Math.round(item.points * 0.8 * 10) / 10;
  if (ratio >= 0.4) return Math.round(item.points * 0.6 * 10) / 10;
  if (ratio >= 0.3) return Math.round(item.points * 0.3 * 10) / 10;
  return 0;
}

function autoGradeMemorization(essayAnswers) {
  let totalScore = 0;
  const detail = [];
  for (const q of ESSAY_QUESTIONS) {
    const ua = essayAnswers[q.id] || "";
    const earned = gradeEssayAnswer(ua, q);
    totalScore += earned;
    const ans = normalize(ua);
    const groups = q.keywords || [];
    let passed = 0;
    for (const group of groups) {
      if (group.some(kw => ans.includes(normalize(kw)))) passed++;
    }
    detail.push({
      id: q.id,
      user: ua,
      max: q.points,
      earned,
      matched_groups: passed,
      total_groups: groups.length,
      answer_text: q.answer_text,
    });
  }
  return { score: Math.round(totalScore * 10) / 10, detail };
}

window.examDataFeedback = {
  EXAM_TITLE,
  EXAM_SUBTITLE,
  ESSAY_QUESTIONS,
  autoGradeMemorization,
  gradeEssayAnswer,
  normalize,
};
})();
