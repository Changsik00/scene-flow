# Task List: spec-01-04

> 모든 task 는 한 commit 에 대응합니다 (One Task = One Commit).

## Pre-flight (Plan 작성 단계)

- [x] Spec ID 확정 및 디렉토리 생성 (sdd spec new)
- [x] spec.md 작성
- [x] plan.md 작성
- [x] task.md 작성 (이 파일)
- [x] 백로그 업데이트 (phase-01.md SPEC 표 — sdd 자동 갱신)
- [x] 사용자 Plan Accept

---

## Task 1: 브랜치 + scaffolds

### 1-1. 브랜치 생성
- [x] `git checkout -b spec-01-04-animations-and-fragments`

### 1-2. spec/plan/task scaffolds add
- [x] `git add specs/spec-01-04-animations-and-fragments/{spec,plan,task}.md`
- [x] Commit: `chore(spec-01-04): add spec/plan/task scaffolds`

---

## Task 2: parser 확장 (TDD)

### 2-1. 테스트 작성 (Red)
- [x] `studio/test/ir.parser.test.ts` 에 케이스 2개 추가:
  1. `transition: zoom` 추출
  2. `transition: invalid-value` 무시
- [x] `cd studio && pnpm run test` → Fail 확인
- [x] Commit: `test(spec-01-04): add failing tests for transition meta extraction`

### 2-2. 구현 (Green)
- [x] `studio/src/ir/parser.ts` 갱신:
  - `Transition` union type export
  - `SceneMeta.transition` 추가
  - frontmatter 루프에서 `transition` 키 처리 + 화이트리스트 검증
- [x] `pnpm run test` → 모두 PASS
- [x] `./.harness-kit/bin/sdd test passed`
- [x] Commit: `feat(spec-01-04): extract transition meta from frontmatter`

---

## Task 3: loader 확장 (TDD)

### 3-1. 테스트 작성 (Red)
- [x] `studio/test/scenes.loader.test.ts` 에 케이스 2개 추가:
  - frontmatter `transition: fade` → `<section data-transition="fade">`
  - `transition` 없음 → `<section>` 그대로
- [x] `pnpm run test` → Fail 확인
- [x] Commit: `test(spec-01-04): add failing tests for data-transition injection`

### 3-2. 구현 (Green)
- [x] `studio/src/scenes/loader.ts` 갱신:
  - 내부 helper `withTransition(section, transition)` — `<section>` 시작 태그 치환
  - `loadAllScenes` 안에서 sections 를 scene 별 transition 으로 매핑
- [x] `pnpm run test` → 모두 PASS
- [x] `./.harness-kit/bin/sdd test passed`
- [x] Commit: `feat(spec-01-04): inject data-transition in loader`

---

## Task 4: PDF 호환 CSS + 샘플 scene 갱신

### 4-1. PDF 호환 CSS
- [x] `studio/src/index.html` 의 `<head>` 에 `<style>@media print { .fragment { opacity: 1 !important; visibility: visible !important; } }</style>` 추가

### 4-2. scene 파일 갱신
- [x] `studio/src/scenes/01-hello.md` frontmatter 에 `transition: zoom` 추가
- [x] `studio/src/scenes/02-layered-model.md` 에 `transition: slide` 추가
- [x] `studio/src/scenes/03-event-log.md` 에 `transition: fade` + 본문 끝에 fragment 3개 (`<ul>` + `<li class="fragment">`)

### 4-3. 검증
- [x] `pnpm run build` → 에러 0
- [x] `pnpm run test` → 모두 PASS (회귀)

### 4-4. Commit
- [x] Commit: `feat(spec-01-04): apply transitions to scenes and add fragments to scene 3`

---

## Task 5: Playwright 자동 검증

### 5-1. Playwright 일회성 install
- [x] `pnpm add -D playwright`
- [x] `pnpm exec playwright install chromium` (캐시 재사용)

### 5-2. 검증 스크립트
- [x] `studio/.verify-anim-frag.mjs` 작성 — 12 체크:
  - transition 속성 (3 scene)
  - fragment 개수 / 등장 시퀀스 (4 단계)
  - 마지막에서 → 정지 + fragment 모두 보임
  - 콘솔 에러 0
- [x] dev 서버 백그라운드 실행 + 스크립트 실행 → PASS

### 5-3. 정리
- [x] `rm studio/.verify-anim-frag.mjs`
- [x] `pnpm remove playwright`
- [x] dev 서버 정지

### 5-4. Commit
- [x] `git add specs/spec-01-04-animations-and-fragments/screenshot-fragments-all.png`
- [x] Commit: `test(spec-01-04): playwright verification of transitions and fragments`

---

## Task 6: docs/planning 보강 (선택)

### 6-1. planning.md
- [x] §2 Phase 1 산출물에 "transition (frontmatter) + fragment (`<li class="fragment">`) 컨벤션" 한 줄 추가

### 6-2. Commit (변경 있으면)
- [x] Commit: `docs(spec-01-04): note transition and fragment conventions`

---

## Task 7: Ship

- [x] **타입 체크**: `pnpm run build` 에러 0
- [x] **전체 테스트**: `pnpm run test` PASS (parser 5 + loader 6 = 11)
- [-] (Integration Test Required = no)
- [x] **walkthrough.md 작성** — 결정 / 검증 결과 / 격리 정책 부분 위반 노트
- [x] **pr_description.md 작성**
- [x] **Ship Commit**: `docs(spec-01-04): ship walkthrough and pr description`
- [x] **Push**: `git push -u origin spec-01-04-animations-and-fragments`
- [x] **PR 생성**: `gh pr create` (사용자 `[Y/n]`)
- [x] **사용자 알림**: PR URL

---

## 진행 요약

| 항목 | 값 |
|---|---|
| **총 Task 수** | 7 (Pre-flight 별도) |
| **예상 commit 수** | 9~10 |
| **현재 단계** | Ship |
| **마지막 업데이트** | 2026-05-10 |
