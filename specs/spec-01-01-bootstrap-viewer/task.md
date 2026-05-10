# Task List: spec-01-01

> 모든 task 는 한 commit 에 대응합니다 (One Task = One Commit).
> 매 commit 직후 본 파일의 체크박스를 갱신해야 합니다.

## Pre-flight (Plan 작성 단계)

- [x] Spec ID 확정 및 디렉토리 생성
- [x] spec.md 작성
- [x] plan.md 작성
- [x] task.md 작성 (이 파일)
- [x] 백로그 업데이트 (phase-01.md SPEC 표 — sdd 자동 갱신)
- [x] 사용자 Plan Accept

---

## Task 1: 브랜치 + 잔재 정리 (Chore)

### 1-1. feature 브랜치 생성
- [x] `git checkout -b spec-01-01-bootstrap-viewer`
- [x] Commit: 없음 (브랜치 생성만)

### 1-2. `.gitignore` 추가 항목
- [x] `.gitignore` 에 `node_modules/`, `dist/`, `.DS_Store` 추가 (기존 항목 유지)

### 1-3. 잔재 add + 한 commit
- [x] `git add backlog/queue.md backlog/phase-01.md`
- [x] `git add .gitignore CLAUDE.md`
- [x] `git add .claude/settings.json .claude/commands` (단, `.claude/state` 는 ignore)
- [x] `git add specs/spec-01-01-bootstrap-viewer` (spec/plan/task — walkthrough 는 ship 단계에서 생성)
- [x] `git status` 로 main 머지 후 떠 있던 잔재가 모두 staged 인지 확인
- [x] Commit: `chore(spec-01-01): cleanup post-rebrand residuals and bootstrap spec scaffolds`

---

## Task 2: ADR 작성

### 2-1. ADR-001 — Scene IR
- [x] `docs/decisions/ADR-001-scene-ir.md` 작성 (Decision: MD + inline HTML, Context, Alternatives, Consequences)
- [x] Commit: `docs(spec-01-01): add ADR-001 scene IR (markdown + inline html)`

### 2-2. ADR-002 — Render Engine
- [x] `docs/decisions/ADR-002-render-engine.md` 작성 (Decision: Reveal.js, 점진 이주 정책, Alternatives)
- [x] Commit: `docs(spec-01-01): add ADR-002 render engine (reveal.js)`

---

## Task 3: 프로젝트 부트스트랩 (Vite + TS + Reveal)

### 3-1. 패키지 / 빌드 설정
- [x] `package.json` 작성 (이름 `scene-flow`, type module, scripts dev/build/test)
- [x] `vite.config.ts` 작성 (root / publicDir 결정)
- [x] `tsconfig.json` 작성 (strict, ES2022, ESNext, bundler)
- [x] `npm install` 실행 — `node_modules/` 생성 (.gitignore 에 의해 제외), `package-lock.json` 생성

### 3-2. 최소 viewer 골격 (Reveal init 만, scene 로드 미포함)
- [x] `src/index.html` 작성 (Reveal markup 골격 + viewer.ts 모듈 import)
- [x] `src/viewer.ts` stub — `new Reveal(...).initialize()` 만 호출
- [x] Reveal CSS / theme import (viewer.ts 에서 ESM import)

### 3-3. Hello scene 작성
- [x] `public/scenes/hello.md` 작성 (frontmatter title + 본문 + inline HTML grid 예시)

### 3-4. dev 서버 동작 확인 (수동)
- [x] `npm run dev` 실행 → 5173 점유로 5174 로 자동 fallback, HTTP 200 응답, hello.md 정상 서빙 확인
- [x] dev 서버 정지

### 3-5. Commit
- [x] `git add package.json package-lock.json vite.config.ts tsconfig.json src/ public/`
- [x] Commit: `feat(spec-01-01): scaffold project with vite, typescript, reveal.js`

---

## Task 4: IR 파서 (TDD)

### 4-1. 테스트 작성 (Red)
- [x] `test/ir.parser.test.ts` 작성 — 3 케이스:
  1. 단순 헤더 + 본문
  2. inline HTML 보존
  3. frontmatter 추출 + 본문 분리
- [x] `npm run test` 실행 → Fail 확인 (parser 없음)
- [x] Commit: `test(spec-01-01): add failing tests for IR parser`

### 4-2. 구현 (Green)
- [x] `src/ir/parser.ts` 작성:
  - `SceneMeta`, `SceneIR` 타입 export
  - frontmatter 분리 (정규식)
  - markdown-it 으로 본문 → HTML
  - `<section>` 으로 감싸서 `sections` 배열에 push
- [x] `npm run test` 실행 → 3 케이스 모두 PASS (3/3)
- [x] `./.harness-kit/bin/sdd test passed` 호출 (테스트 통과 기록)
- [x] Commit: `feat(spec-01-01): implement minimal IR parser`

---

## Task 5: viewer 통합 + Hello World 동작

### 5-1. viewer.ts 에 scene 로드 + parser 호출 추가
- [x] `src/viewer.ts` 수정:
  - `/scenes/hello.md` fetch
  - `parseScene(md)` 호출
  - 결과를 `#slides` 에 innerHTML 로 주입
  - Reveal init (frontmatter `title` 도 `document.title` 로 반영)

### 5-2. 수동 검증 — Phase 시나리오 1 PASS (Playwright 일회성 자동화)
- [x] `npm run dev` → `http://localhost:5174/` (5173 점유로 fallback)
- [x] Playwright 헤드리스 검증 7/7 PASS — title / h1 / 본문 / 왼쪽 칸 / display:grid / 2칸 472×472 / 콘솔 에러 0
- [x] 스크린샷 캡처 → `specs/spec-01-01-bootstrap-viewer/screenshot-hello.png`
- [x] dev 서버 정지 + `.verify-hello.mjs` 삭제 (Playwright 는 `--no-save` 라 package.json 미변경, `node_modules/playwright` 는 .gitignore)

### 5-3. Commit
- [x] Commit: `feat(spec-01-01): wire IR parser to viewer for hello world`

---

## Task 6: Ship

> 모든 작업 task 완료 후 `/hk-ship` 절차를 따릅니다.

- [x] **타입 체크**: `npm run build` (tsc) 에러 0건 — 첫 시도 3 에러 (reveal 타입 / .ts ext × 2) → `@types/reveal.js` 추가 + 확장자 제거 후 PASS, 별 chore commit `f94979b`
- [x] **전체 테스트**: `npm run test` PASS 3/3 (`sdd test passed` = 2026-05-10T10:13:06Z)
- [-] (Integration Test Required = no — 시나리오 1 은 Playwright 헤드리스 일회성 으로 PASS)
- [x] **walkthrough.md 작성** — 결정 9건 / 사용자 협의 5건 / 검증 결과 / 스크린샷 / 발견 4건
- [x] **pr_description.md 작성** — 템플릿 준수 + Key Review Points 5건
- [x] **Ship Commit**: `docs(spec-01-01): ship walkthrough and pr description`
- [x] **Push**: `git push -u origin spec-01-01-bootstrap-viewer`
- [x] **PR 생성**: `gh pr create`
- [x] **사용자 알림**: 푸시 완료 + PR URL 보고

---

## 진행 요약

| 항목 | 값 |
|---|---|
| **총 Task 수** | 6 (Pre-flight 별도) |
| **예상 commit 수** | 8 (chore / ADR-001 / ADR-002 / scaffold / test red / parser green / viewer wire / ship) |
| **현재 단계** | Ship |
| **마지막 업데이트** | 2026-05-10 |
