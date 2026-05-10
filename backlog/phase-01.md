# phase-1: scene-engine

> 본 phase 의 모든 SPEC 을 한 파일에 요점 / 방향성으로 나열합니다.
> *구체적* 작업 내용은 각 `specs/spec-1-{seq}-{slug}/spec.md` 에서 다룹니다.
>
> 본 문서는 "이번 phase 에서 무엇을 어디까지 할 것인가" 를 한 번에 보기 위한 *업무 지도* 입니다.

## 📋 메타

| 항목 | 값 |
|---|---|
| **Phase ID** | `phase-1` |
| **상태** | Planning |
| **시작일** | 2026-05-10 |
| **목표 종료일** | 미정 (spec 5개 추정 — 1~2주 단위 진행) |
| **소유자** | dennis |
| **Base Branch** | 없음 (각 spec PR 이 main 직접 타게) |

## 🎯 배경 및 목표

### 현재 상황

`spec-x-rebrand-vision` (PR #1) 머지로 비전과 4-layer Phase 모델이 굳었으나, **코드는 0줄**. layered 모델의 가장 아래층 (Scene Engine) 이 비어 있어 위 layer (Recording / Composition / AI) 가 모두 가설 단계.

또한 비전 문서의 Open Questions §5.2~§5.3 에서 의도적으로 미결로 남긴 두 결정 — **Scene IR 형식 (Markdown / HTML / DSL)** 과 **렌더 엔진 (Reveal.js / Remotion / 자체)** — 은 phase-1 에서 *처음으로 코드와 함께* 결정되어야 한다.

### 목표 (Goal)

**HTML scene 한 장을 작성 → 브라우저 viewer 로 발표 → PDF 출력** 한 사이클이 끊김 없이 도는 *최소 동작 base layer* 를 만든다. 이게 끝나면:

- 단독으로도 Reveal.js / Marp 의 자리에 설 수 있고,
- 위 layer (phase-2 Recording 등) 가 이 viewer 와 IR 위에 자연스럽게 얹히게 된다.

### 성공 기준 (Success Criteria) — 정량 우선

1. **단일 scene 표시**: scene 파일 1장 작성 → 브라우저로 열어 풀스크린 / 키보드 입력으로 표시할 수 있다.
2. **다중 scene 네비게이션**: scene 3장 이상 → ←/→/PgUp/PgDn / Space / Esc 풀스크린이 모두 동작.
3. **CSS 애니메이션 ≥3종**: fade / slide-up / zoom 중 최소 3종이 scene 전환 시 동작 + fragment 등장 1종.
4. **PDF 출력**: 동일 콘텐츠가 `@media print` 로 페이지 단위로 깔끔히 떨어진다 (애니메이션 잔재 / 잘림 없음).
5. **통합 시나리오 PASS**: 위 1~4 가 한 흐름으로 연결되어 동작 (시나리오 §아래 참조).

## 🧩 작업 단위 (SPECs)

> 본 표는 phase 의 *작업 지도* 입니다. SPEC 은 *요점 + 방향성 + 참조* 까지만 적습니다.
> 자세한 spec / plan / task 는 `specs/spec-1-{seq}-{slug}/` 에서 작성합니다.
> sdd 가 `<!-- sdd:specs:start --> ~ <!-- sdd:specs:end -->` 사이를 자동 갱신하므로 마커는 그대로 두세요.

<!-- sdd:specs:start -->
| ID | 슬러그 | 우선순위 | 상태 | 디렉토리 |
|---|---|:---:|---|---|
| `spec-01-01` | bootstrap-viewer | P? | Active | `specs/spec-01-01-bootstrap-viewer/` |
<!-- sdd:specs:end -->

> 상태 허용값: `Backlog` / `In Progress` / `Merged`
> sdd 가 ship 시 자동으로 `Merged` 로 갱신합니다. `In Progress` 는 active spec 에 자동 마킹됩니다.

### spec-1-01 — IR + 렌더 엔진 결정 + 최소 viewer (+ 잔재 정리)

- **요점**: Scene IR 형식과 렌더 엔진을 결정하고 (ADR 작성), "hello world" scene 1장이 브라우저에 떠야 한다. 동시에 phase-x-rebrand-vision 머지 후 main 에 떠 있던 잔재 (`backlog/queue.md`, `.gitignore`, `CLAUDE.md`, `.claude/`) 도 본 spec 의 첫 task 에서 같이 정리한다.
- **방향성**:
  1. Scene IR 결정 → ADR-001
  2. 렌더 엔진 결정 → ADR-002
  3. 최소 viewer 구현 (한 scene 파일 → 브라우저 표시)
  4. 잔재 정리 (workspace cleanup)
- **참조**:
  - `docs/planning.md` Open Questions §5.2 (IR 형식), §5.3 (렌더 엔진)
  - 신규 작성: `docs/decisions/ADR-001-scene-ir.md`, `docs/decisions/ADR-002-render-engine.md`
- **연관 모듈**: 신규 — 최소 src/, public/ (실제 경로는 spec.md 에서 결정)

### spec-1-02 — 키보드 / 풀스크린 네비게이션

- **요점**: 다중 scene 간 이동 (←/→ / PgUp/PgDn / Space) + 풀스크린 토글 (F / Esc).
- **방향성**: spec-1-01 의 viewer 위에 키 핸들러 + Fullscreen API. URL hash 동기화 (`#/scene-2`) 로 새로고침해도 같은 scene 유지.
- **참조**: spec-1-01 viewer 코드 + MDN Fullscreen API.
- **연관 모듈**: viewer 입력 모듈 (spec-1-01 에서 결정된 경로).

### spec-1-03 — CSS 애니메이션 + Fragment 등장

- **요점**: scene 전환 애니메이션 ≥3종 (fade / slide-up / zoom) + fragment (클릭마다 한 항목씩 등장).
- **방향성**: 순수 CSS `@keyframes` + `transition` + 약간의 JS (fragment 카운터). 프레임워크 의존 없음.
- **참조**: spec-1-01 IR 결정 결과 (애니메이션 메타데이터를 IR 어디에 둘지).
- **연관 모듈**: viewer 의 scene 전환 / fragment 진행 모듈.

### spec-1-04 — PDF 출력 (`@media print`)

- **요점**: 같은 viewer URL 을 브라우저 인쇄 → PDF 로 저장하면 scene 단위로 페이지가 정확히 떨어진다.
- **방향성**: `@media print` 룰 — `.scene { page-break-after: always; }`, `.animation-only { display: none; }` 등. fragment 의 *최종 상태* 가 PDF 에 보이도록.
- **참조**: spec-1-03 의 애니메이션 / fragment 정의.
- **연관 모듈**: 전역 print stylesheet.

### spec-1-05 (선택) — Markdown → Scene 파서

- **요점**: 만약 spec-1-01 에서 IR 을 HTML 단독이 아닌 *Markdown 입력* 으로 결정했을 경우, Markdown → 내부 IR 변환기.
- **방향성**: 단순 markdown-it 위에 frontmatter / `---` 구분 / fragment 주석 / scene 메타데이터 처리. 결정에 따라 본 spec 자체가 불필요할 수 있음.
- **참조**: spec-1-01 의 ADR-001.
- **연관 모듈**: 신규 파서 모듈.

> **참고**: spec-1-05 의 필요 여부는 spec-1-01 의 IR 결정 시점에 결정됨. 결정에 따라 본 phase 의 총 spec 수는 4 또는 5.

## 🧪 통합 테스트 시나리오 (간결)

> 본 phase 의 Done 조건 중 하나. 각 시나리오는 사람이 직접 / 또는 Playwright 스크립트로 검증 (수단은 spec-1-01 에서 결정).

### 시나리오 1: 단일 scene 표시
- **Given**: scene 1장이 작성된 상태
- **When**: 브라우저로 viewer URL 을 연다
- **Then**: scene 콘텐츠가 화면 가득 표시되고, F 키로 풀스크린이 토글된다
- **연관 SPEC**: spec-1-01, spec-1-02

### 시나리오 2: 다중 scene 네비 + 애니메이션 + fragment
- **Given**: scene 3장 (각각 fragment 2~3개 + 전환 애니메이션 종류 다름)
- **When**: → 키를 연속해 눌러 scene 1 → 2 → 3 순으로 진행
- **Then**: 각 scene 전환 시 애니메이션이 동작하고, fragment 가 한 번 누를 때마다 하나씩 등장하며, scene 3 도달 후 → 키는 멈춘다 (또는 끝 스크린)
- **연관 SPEC**: spec-1-02, spec-1-03

### 시나리오 3: PDF 출력
- **Given**: 시나리오 2 의 동일 콘텐츠
- **When**: 브라우저 인쇄 → "PDF 로 저장"
- **Then**: scene 3장이 각각 1페이지로 떨어지고, 모든 fragment 의 *최종 상태* 가 PDF 에 포함되며, 애니메이션 잔재 / 잘림이 없다
- **연관 SPEC**: spec-1-04

### 통합 테스트 실행

```bash
# 본 phase 의 통합 테스트만 (실제 명령은 spec-1-01 의 스택 결정 후 확정)
# 후보:
#   - npx playwright test test/e2e/phase-1
#   - 또는 수동 시나리오 (체크리스트로 walkthrough.md 에 기록)
```

## 🔗 의존성

- **선행 phase**: 없음 (base layer)
- **외부 시스템**: 없음 (브라우저 1개로 동작)
- **연관 ADR** (phase 진행 중 작성):
  - `docs/decisions/ADR-001-scene-ir.md` (spec-1-01)
  - `docs/decisions/ADR-002-render-engine.md` (spec-1-01)

## 📝 위험 요소 및 완화

| 위험 | 영향 | 완화책 |
|---|---|---|
| Scene IR 결정이 잘못되면 phase-2 이상까지 영향 (Event Log 매칭, 자막 sync 등 모두 IR 에 의존) | 큼 | spec-1-01 에서 ADR-001 작성 + 사용자 명시 동의. spec 분할로 다른 결정 (네비, 애니, PDF) 은 IR 결정 *후* 진행. |
| 자체 viewer 구현 시 작업량 폭발 (키보드 + 애니 + PDF 등 직접 다 만들면 무거움) | 중 | 첫 일주일 안에 PoC 결과로 판단. 부족하면 Reveal.js 같은 기존 엔진 위로 fallback (= ADR-002 의 두 번째 선택지). |
| 애니메이션이 PDF 에 잘못 출력되어 시나리오 3 가 깨짐 | 중 | spec-1-03 작성 시점부터 `@media print` 호환을 고려 (fragment 의 최종 상태가 print 시 보이도록 CSS 설계). |
| 잔재 정리 (queue.md / .gitignore / CLAUDE.md / .claude) 가 spec-1-01 의 본 작업과 섞임 | 작음 | spec-1-01 의 첫 task 로 잔재만 별도 commit (`chore`) 하고, 본 작업은 별 task 로 분리. |

## 🏁 Phase Done 조건

- [ ] 모든 SPEC 이 main 으로 merge (base branch 모드 OFF)
- [ ] 위 통합 테스트 시나리오 1~3 모두 PASS
- [ ] 성공 기준 §1~5 정량 측정 결과를 본 문서 "검증 결과" 섹션에 기록
- [ ] ADR-001 (Scene IR) / ADR-002 (Render Engine) 가 `docs/decisions/` 에 작성되어 있고 phase 의 결정과 일치
- [ ] 사용자 최종 승인 (`/hk-phase-ship` 절차)

## 📊 검증 결과 (phase 완료 시 작성)

<!-- 통합 테스트 로그, 성공 기준 측정값, 회귀 점검 결과 등을 여기 첨부 -->
