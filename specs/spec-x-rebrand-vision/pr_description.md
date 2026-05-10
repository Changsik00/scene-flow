# docs(spec-x-rebrand-vision): rebrand to scene-flow and redefine vision

## 📋 Summary

### 배경 및 목적

옛 이름 `html-to-ppt` 는 "기능 설명형" 이라 단순 컨버터처럼 보이고, 같은 류 이름이 npm/검색에 다수 존재해 브랜딩이 약했다. 더 큰 문제는 **이름이 비전을 가뒀다는 것** — 실제 방향은 "HTML scene 을 base 로 두고 그 위에 녹화/음성/자막을 overlay 하는 layered presentation & video pipeline" 이다. 또한 옛 `docs/planning.md` 의 Phase 1~4 가 평면 기능 나열이라, 앞으로의 SDD spec 들이 참조할 비전 문서 역할을 못 했다.

본 PR 은 **이름을 `scene-flow` 로 굳히고, README/planning 을 layered overlay 모델 기준으로 재작성**한다. 코드 변경 없음 — 이후 phase 작업의 *기준점* 을 만든다.

### 주요 변경 사항

- [x] 프로젝트 이름 `html-to-ppt` → **`scene-flow`** 로 리브랜드
- [x] **README.md 전면 재작성** — 한 줄 비전 / 핵심 멘탈 모델 (HTML base + overlay) / Phase 1~4 가치 표 / Reveal.js·Loom·Remotion 비교
- [x] **docs/planning.md 전면 재작성** — 옛 4-phase 제거, 새 **Scene Engine → Recording → Composition → AI Automation** 4-layer 정의
- [x] **Scene Event Log** 컨셉 명문화 (Phase 2 의 핵심 무기, JSONL 예시)
- [x] **A/C 결정 보류 정책** 명시 (Live overlay A 부터 + Event Log → 필요 시 Post composition C 확장)
- [x] **Open Questions** 섹션 신설 — Scene IR 형식 / 렌더 엔진 / 캡처 메커니즘 등 phase-01 진입 시 결정할 항목 목록화
- [x] 옛 이름 흔적 grep 검증 — 사용자 문서 / 코드 0건 확인

### Phase 컨텍스트

- **Phase**: N/A (Solo Spec — `spec-x-rebrand-vision`)
- **본 SPEC 의 역할**: 이후 모든 phase 작업의 비전 / 단계 기준점을 굳힘. phase-01 (Scene Engine) 작업은 본 PR merge 이후 별도 SDD-P 흐름으로 시작.

## 🎯 Key Review Points

1. **이름 / 비전 정합성** — `README.md` 의 한 줄 비전 + 멘탈 모델이 사용자 의도 ("HTML scene 을 준비하고 그 위에 강의·녹화·편집을 덮는 구조") 와 정확히 일치하는가.
2. **Phase 분할의 layered 일관성** — 4 phase 가 layered 모델의 4 layer 와 1:1 매핑되고, 각 phase 가 *거기서 멈춰도 가치가 있는지* 명시되어 있는가.
3. **Scene Event Log 의 위치** — Phase 2 의 핵심 무기로 충분히 강조되어 있고, README/planning 양쪽에서 이 컨셉이 자연스럽게 등장하는가. JSONL 형식이 직관적인가.
4. **A/C 결정 보류 정책** — "사용해보면서 결정" 합의가 문서에 굳어 있고, Event Log 가 두 모드 모두 호환하는 이유가 분명히 설명되어 있는가.
5. **Open Questions 의 적절성** — 본 PR 에서 *결정하지 않은* 항목 (Scene IR 형식, 렌더 엔진 등) 이 phase-01 의 첫 spec 으로 자연스럽게 이어지는가.

## 🧪 Verification

### 자동 테스트

- 본 SPEC 은 docs only — 단위 / 통합 테스트 면제 (constitution §9.1 예외).

### 수동 검증 시나리오

1. **README 30초 진입 테스트** → 첫 스크롤 안에 비전 / 멘탈 모델 / Phase 표가 모두 보임. ✓
2. **옛 이름 흔적 grep** → 사용자 문서 / 코드 0건. ✓
3. **README Phase 표 ↔ planning Phase 정의 1:1 매칭** → Scene Engine / Recording / Composition / AI Automation 모두 동일하게 등장. ✓
4. **Scene Event Log 명문화** → `docs/planning.md` §3 에 JSONL 예시 + 활용 시나리오 표. ✓
5. **A/C 보류 정책 명시** → `docs/planning.md` §5.1 에 정책 문구 ("A 부터 + Event Log → 부족하면 C 로 확장"). ✓

## 📦 Files Changed

### 🆕 New Files

- `specs/spec-x-rebrand-vision/spec.md`: 본 SPEC 의 요구사항 / Out of Scope / DoD
- `specs/spec-x-rebrand-vision/plan.md`: Branch 전략 / 주요 결정 / Proposed Changes / 검증 시나리오
- `specs/spec-x-rebrand-vision/task.md`: 5 task (브랜치 / README / planning / 이름정리(통과) / Ship)
- `specs/spec-x-rebrand-vision/walkthrough.md`: 결정 기록 / 사용자 협의 / 검증 결과
- `specs/spec-x-rebrand-vision/pr_description.md`: 본 문서

### 🛠 Modified Files

- `README.md` (전면 재작성): 옛 "html-to-ppt 컨버터" 프레임 제거 → `scene-flow` layered pipeline 비전 / Phase 1~4 가치 표 / 비교표
- `docs/planning.md` (전면 재작성): 옛 Phase 1~4 / 디렉토리 구조 / 확장 아이디어 제거 → 새 4-layer Phase 정의 + Scene Event Log + Open Questions

### 🗑 Deleted Files

- 없음 (전면 재작성은 modify 로 처리, git history 로 추적 가능).

**Total**: 7 files changed (5 new + 2 modified).

## ✅ Definition of Done

- [x] (단위 테스트 없음 — docs only, constitution §9.1 예외)
- [x] `walkthrough.md` 작성 및 ship commit 예정
- [x] `pr_description.md` 작성 및 ship commit 예정
- [x] `spec-x-rebrand-vision` 브랜치 push 예정
- [ ] PR 생성 및 사용자 검토 요청 알림 (본 commit 직후 진행)

## 🔗 관련 자료

- Spec: `specs/spec-x-rebrand-vision/spec.md`
- Plan: `specs/spec-x-rebrand-vision/plan.md`
- Walkthrough: `specs/spec-x-rebrand-vision/walkthrough.md`
- Constitution §5.1 (Solo Spec 조건), §9.1 (docs only 테스트 예외)
