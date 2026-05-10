# Walkthrough: spec-x-rebrand-vision

> 본 문서는 *작업 기록* 입니다. 결정 과정, 사용자 협의, 검증 결과를 남깁니다.

## 📌 결정 기록

| 이슈 | 선택지 | 결정 | 이유 |
|---|---|---|---|
| 프로젝트 이름 | `html-to-ppt` 유지 / 새 이름 | **`scene-flow`** | "html-to-ppt" 는 기능 설명형 이름. 비슷한 이름이 npm/검색에 다수 존재해 브랜딩 약함. "scene" 이 IR (HTML), "flow" 가 pipeline 을 표현 — 비전과 일치. |
| 비전 프레임 | "PPT 변환기" / "presentation engine" / "layered overlay" | **layered overlay 모델** | 사용자 핵심 통찰: "scene = HTML, 그 위에 녹화/음성/자막을 덮어 최종본". 발표 도구와 영상 파이프라인을 한 축으로 묶음. |
| Phase 분할 | 옛 4-phase 유지 / 새 layered 4-phase | **Scene Engine → Recording → Composition → AI** | 각 phase 가 layered 모델의 한 layer 와 1:1 대응. 각 phase 가 거기서 멈춰도 독립적으로 가치를 가짐. |
| Live overlay (A) vs Post composition (C) | A 만 / C 만 / 둘 다 / 결정 보류 | **A 부터 + Scene Event Log 항상 기록 → C 호환** | 사용자 의견: "한번에 녹화할 능력이 될지 모르겠다, 사용해보면서 결정". Event Log 가 있으면 어느 쪽이든 호환. 코드 버릴 일 없음. |
| Scene Event Log 위치 | 부수 / 핵심 무기 | **핵심 무기로 명문화** | Phase 2~3 의 차별점 (자막 sync, scene 재렌더링, 챕터 자동 생성) 이 모두 Event Log 에서 파생. README/planning 양쪽에 등장. |
| `.harness-kit/` 처리 | 정리 포함 / 제외 | **제외** | 외부 키트, 본 프로젝트의 변경 대상이 아님. |
| Scene IR 형식 (Markdown/HTML/DSL) | 본 SPEC 에서 결정 / 보류 | **보류** | phase-01 의 첫 spec 에서 결정. Open Questions 섹션에 명시. |
| 렌더 엔진 (Reveal.js / Remotion / 자체) | 본 SPEC 에서 결정 / 보류 | **보류** | 동일 — phase-01 결정. |

## 💬 사용자 협의

- **주제**: 이름 변경
  - **사용자 의견**: `html-to-ppt` 가 비전을 가두고, 검색해보니 같은 이름이 많아 브랜딩이 약함. 본질은 AI-native presentation/runtime pipeline.
  - **합의**: `scene-flow` 로 확정. README/planning 을 새 비전으로 재작성.
- **주제**: 비전 모델
  - **사용자 의견**: "Scene 의 본질은 HTML. 그 위에 자막/녹화/목소리를 덮어 최종본을 뽑는 구조 — 단계로 표현하면 *PPT(HTML) 준비 → 강의·녹화 → 추가 편집*."
  - **합의**: layered overlay 모델로 명문화. PPT 는 export target 중 하나로 강등.
- **주제**: 라이브 vs 후합성 (A/C) 결정
  - **사용자 의견**: "A 에 가까운데, 한 번에 녹화할 능력이 될지 모르겠다. 사용해보면서 결정."
  - **합의**: A 부터 시작 + Scene Event Log 항상 기록 → 부족하면 C 로 확장. 정책을 문서에 굳힘.
- **주제**: 진행 경로
  - **사용자 의견**: "길 1 (spec-x 로 리브랜드 + 비전 재정의 먼저) 로 가자."
  - **합의**: `spec-x-rebrand-vision` 단일 PR 로 처리. phase-01 작업은 본 SPEC merge 이후 별도 SDD-P 흐름.

## 🧪 검증 결과

### 1. 자동화 테스트

- 본 SPEC 은 docs only — 단위 / 통합 테스트 면제 (constitution §9.1 예외).

### 2. 수동 검증

1. **Action**: `README.md` 30초 진입 테스트 — 첫 화면만 보고 "scene-flow 가 무엇이고 단계별로 뭘 하는가" 를 이해할 수 있는가
   - **Result**: ✓ 한 줄 비전 + 핵심 멘탈 모델 박스 + Phase 1~4 가치 표가 첫 스크롤 안에 모두 보임.
2. **Action**: 옛 이름 흔적 grep — `grep -rniE "html[-_]?to[-_]?ppt|html2pptx|htmltoppt" --exclude-dir={.harness-kit,.git,.claude} .`
   - **Result**: hit 7건. 모두 본 SPEC 문서 (spec/plan/task) 내부에서 *과거 사실 / grep 패턴 자체* 로만 인용. `README.md` / `docs/` / `CLAUDE.md` 등 사용자 문서 / 코드에는 0건 — 정리 대상 없음 (Task 4 [-] 통과 처리).
3. **Action**: README Phase 표 (4행) ↔ `docs/planning.md` Phase 정의 (§2.1~§2.4) 1:1 매칭 확인
   - **Result**: ✓ Scene Engine / Recording / Composition / AI Automation 모두 양쪽에 동일하게 등장.
4. **Action**: Scene Event Log JSONL 예시가 `docs/planning.md` §3 에 있고, A/C 보류 정책이 §5.1 에 명시되어 있는가
   - **Result**: ✓ 둘 다 확인.

## 🔍 발견 사항

- `.harness-kit/CLAUDE.fragment.md` 가 옛 이름을 언급하지 않아 CLAUDE.md 추가 정리 불필요했음 (외부 키트가 프로젝트 이름에 의존하지 않게 잘 설계되어 있음).
- `docs/planning.md` 의 Open Questions 섹션이 phase-01 의 첫 spec (Scene IR 형식 / 렌더 엔진 결정) 의 자연스러운 진입점이 됨 — 다음 SDD-P 흐름의 출발점.
- 옛 README/planning 에 있던 "확장 아이디어" (실시간 미리보기, 코드 하이라이팅, OBS 연동 등) 는 새 Phase 모델로 흡수 / 재배치되었으나, Phase 4 이후에 둘 가능성 있는 항목 (템플릿 마켓 등) 은 별도 backlog 화 가능.

## 🚧 이월 항목

- 없음. 본 SPEC 의 Out of Scope 항목 (phase-01 작업, 디렉토리 구조, GitHub repo 이름 변경 등) 은 모두 의도된 분리이며 별도 SDD 흐름에서 처리.

## 📅 메타

| 항목 | 값 |
|---|---|
| **작성자** | Agent (Opus 4.7) + dennis |
| **작성 기간** | 2026-05-10 |
| **본 ship 직전 commit** | `ae922a4` |
