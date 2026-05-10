# Task List: spec-01-03

> 모든 task 는 한 commit 에 대응합니다 (One Task = One Commit).
> 매 commit 직후 본 파일의 체크박스를 갱신해야 합니다.

## Pre-flight (Plan 작성 단계)

- [x] Spec ID 확정 및 디렉토리 생성 (sdd spec new)
- [x] spec.md 작성
- [x] plan.md 작성
- [x] task.md 작성 (이 파일)
- [x] 백로그 업데이트 (phase-01.md SPEC 표 — sdd 자동 갱신)
- [x] 사용자 Plan Accept

---

## Task 1: 브랜치 + scene 파일 이동 / 추가

### 1-1. feature 브랜치 생성
- [x] `git checkout -b spec-01-03-multi-scene-navigation`
- [x] Commit: 없음

### 1-2. scene 파일 이동 + 추가
- [x] `git mv studio/public/scenes/hello.md studio/src/scenes/01-hello.md`
- [x] `studio/public/scenes/` 디렉토리 비어 있으면 삭제 (없는 디렉토리 또는 .gitkeep)
- [x] `studio/src/scenes/02-layered-model.md` 작성 (frontmatter title + 본문 — layered overlay 모델 시연)
- [x] `studio/src/scenes/03-event-log.md` 작성 (frontmatter title + Scene Event Log 핵심 무기 시연)
- [x] Commit: `feat(spec-01-03): move scenes to src/scenes and add 2 demo scenes`

### 1-3. spec / plan / task pre-flight 산출물 add
- [x] `git add specs/spec-01-03-multi-scene-navigation/{spec,plan,task}.md`
- [x] Commit: `chore(spec-01-03): add spec/plan/task scaffolds`

---

## Task 2: loader.ts (TDD)

### 2-1. 테스트 작성 (Red)
- [x] `studio/test/scenes.loader.test.ts` 작성 — 케이스:
  1. **정렬**: 비정렬 입력 → 키 알파벳 정렬 출력
  2. **평탄화**: scene 3개 → sections.length === 3
  3. **빈 입력**: `{}` → 모두 빈 배열
- [x] `cd studio && pnpm run test` → Fail 확인 (loader 없음)
- [x] Commit: `test(spec-01-03): add failing tests for scenes loader`

### 2-2. 구현 (Green)
- [x] `studio/src/scenes/loader.ts` 작성:
  - `LoadedScenes` 인터페이스 export
  - `loadAllScenes(modules)` 순수 함수 export
  - `parseScene` 호출 + sections 평탄화
- [x] `pnpm run test` → 모두 PASS
- [x] `./.harness-kit/bin/sdd test passed` 호출 (project root 에서)
- [x] Commit: `feat(spec-01-03): implement scenes loader (sort + flatten)`

---

## Task 3: viewer.ts 갱신 (다중 scene 주입)

### 3-1. import.meta.glob + loader 통합
- [x] `studio/src/viewer.ts` 수정:
  - `fetch('/scenes/hello.md')` 코드 제거
  - `import.meta.glob('./scenes/*.md', { query: '?raw', import: 'default', eager: true })`
  - `loadAllScenes(...)` 호출 → `sections` 평탄화 → `#slides` 주입
  - 첫 scene 의 `meta.title` 을 `document.title` 로
  - `loop: false` 명시 (마지막 scene 에서 정지)

### 3-2. dev 서버 + build 검증
- [x] `cd studio && pnpm run dev` → 5173 (또는 fallback) → 다중 scene 표시 확인 (curl 또는 다음 task 의 Playwright 로)
- [x] `pnpm run build` → 에러 0, 번들 크기 확인 (이전 대비 증가량 합리적인지)

### 3-3. Commit
- [x] Commit: `feat(spec-01-03): wire multi-scene loader into viewer`

---

## Task 4: Playwright 자동 검증 + 스크린샷

### 4-1. Playwright 일회성 install
- [x] `cd studio && pnpm add -D playwright`
- [x] `pnpm exec playwright install chromium` (캐시 재사용)

### 4-2. 검증 스크립트
- [x] `studio/.verify-multi-nav.mjs` 작성 — 8 체크:
  1. document.title = 첫 scene title
  2. 첫 scene h1 확인
  3. → 1회 → hash 변경 (`#/1`)
  4. → 1회 더 → 마지막 hash (`#/2`)
  5. → 한 번 더 → hash 변화 없음 (정지)
  6. F 키 → fullscreen 시도 (가능한 만큼)
  7. 콘솔 에러 0
  8. 스크린샷 2장 — scene 1 / scene 2

### 4-3. 검증 실행
- [x] dev 서버 백그라운드 실행
- [x] `node ./.verify-multi-nav.mjs` → 통과 보고 (풀스크린 결과 별도 기록)

### 4-4. 정리 + 스크린샷 add
- [x] `rm studio/.verify-multi-nav.mjs`
- [x] `pnpm remove playwright`
- [x] dev 서버 정지
- [x] `git add specs/spec-01-03-multi-scene-navigation/screenshot-scene-*.png`
- [x] Commit: `test(spec-01-03): playwright headless verification of multi-scene navigation`

---

## Task 5: README / docs/planning 보강 (선택)

### 5-1. README 갱신
- [x] 프로젝트 구조 트리에 `studio/src/scenes/` 명시 (있다면 update, 없으면 본 task pass)

### 5-2. docs/planning.md 보강
- [x] §2 Phase 1 산출물에 "scene 디렉토리 자동 발견 + 정렬 컨벤션" 명시

### 5-3. Commit (변경 있으면)
- [x] Commit: `docs(spec-01-03): note scene auto-discovery convention`

---

## Task 6: Ship

> 모든 작업 task 완료 후 `/hk-ship` 절차를 따릅니다.

- [x] **타입 체크**: `cd studio && pnpm run build` 에러 0건
- [x] **전체 테스트**: `pnpm run test` PASS (parser 3 + loader 2~3)
- [-] (Integration Test Required = no)
- [x] **walkthrough.md 작성** — 결정 / 사용자 협의 / 검증 결과 / 풀스크린 한계 노트 / 발견 사항
- [x] **pr_description.md 작성**
- [x] **Ship Commit**: `docs(spec-01-03): ship walkthrough and pr description`
- [x] **Push**: `git push -u origin spec-01-03-multi-scene-navigation`
- [x] **PR 생성**: `gh pr create` (사용자 `[Y/n]`)
- [x] **사용자 알림**: PR URL

---

## 진행 요약

| 항목 | 값 |
|---|---|
| **총 Task 수** | 6 (Pre-flight 별도) |
| **예상 commit 수** | 7~8 (scene mv+add / scaffolds / loader test red / loader green / viewer / playwright / README / ship) |
| **현재 단계** | Ship |
| **마지막 업데이트** | 2026-05-10 |
