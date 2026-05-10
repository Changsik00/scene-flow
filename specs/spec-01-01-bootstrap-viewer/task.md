# Task List: spec-01-01

> 모든 task 는 한 commit 에 대응합니다 (One Task = One Commit).
> 매 commit 직후 본 파일의 체크박스를 갱신해야 합니다.

## Pre-flight (Plan 작성 단계)

- [x] Spec ID 확정 및 디렉토리 생성
- [x] spec.md 작성
- [x] plan.md 작성
- [x] task.md 작성 (이 파일)
- [x] 백로그 업데이트 (phase-01.md SPEC 표 — sdd 자동 갱신)
- [ ] 사용자 Plan Accept

---

## Task 1: 브랜치 + 잔재 정리 (Chore)

### 1-1. feature 브랜치 생성
- [ ] `git checkout -b spec-01-01-bootstrap-viewer`
- [ ] Commit: 없음 (브랜치 생성만)

### 1-2. `.gitignore` 추가 항목
- [ ] `.gitignore` 에 `node_modules/`, `dist/`, `.DS_Store` 추가 (기존 항목 유지)

### 1-3. 잔재 add + 한 commit
- [ ] `git add backlog/queue.md backlog/phase-01.md`
- [ ] `git add .gitignore CLAUDE.md`
- [ ] `git add .claude/settings.json .claude/commands` (단, `.claude/state` 는 ignore)
- [ ] `git add specs/spec-01-01-bootstrap-viewer` (spec/plan/task/walkthrough)
- [ ] `git status` 로 main 머지 후 떠 있던 잔재가 모두 staged 인지 확인
- [ ] Commit: `chore(spec-01-01): cleanup post-rebrand residuals and bootstrap spec scaffolds`

---

## Task 2: ADR 작성

### 2-1. ADR-001 — Scene IR
- [ ] `docs/decisions/ADR-001-scene-ir.md` 작성 (Decision: MD + inline HTML, Context, Alternatives, Consequences)
- [ ] Commit: `docs(spec-01-01): add ADR-001 scene IR (markdown + inline html)`

### 2-2. ADR-002 — Render Engine
- [ ] `docs/decisions/ADR-002-render-engine.md` 작성 (Decision: Reveal.js, 점진 이주 정책, Alternatives)
- [ ] Commit: `docs(spec-01-01): add ADR-002 render engine (reveal.js)`

---

## Task 3: 프로젝트 부트스트랩 (Vite + TS + Reveal)

### 3-1. 패키지 / 빌드 설정
- [ ] `package.json` 작성 (이름 `scene-flow`, type module, scripts dev/build/test)
- [ ] `vite.config.ts` 작성 (root / publicDir 결정)
- [ ] `tsconfig.json` 작성 (strict, ES2022, ESNext, bundler)
- [ ] `npm install` 실행 — `node_modules/` 생성 (.gitignore 에 의해 제외), `package-lock.json` 생성

### 3-2. 최소 viewer 골격 (Reveal init 만, scene 로드 미포함)
- [ ] `src/index.html` 작성 (Reveal markup 골격 + viewer.ts 모듈 import)
- [ ] `src/viewer.ts` stub — `new Reveal(...).initialize()` 만 호출
- [ ] Reveal CSS / theme import

### 3-3. Hello scene 작성
- [ ] `public/scenes/hello.md` 작성 (frontmatter title + 본문 + inline HTML grid 예시)

### 3-4. dev 서버 동작 확인 (수동)
- [ ] `npm run dev` 실행 → `http://localhost:5173` 접속 → 에러 없이 빈 Reveal 화면이 뜸 (이 단계에선 hello scene 미연결, 빈 deck 으로 충분)
- [ ] `Ctrl+C` 로 dev 서버 종료

### 3-5. Commit
- [ ] `git add package.json package-lock.json vite.config.ts tsconfig.json src/ public/`
- [ ] Commit: `feat(spec-01-01): scaffold project with vite, typescript, reveal.js`

---

## Task 4: IR 파서 (TDD)

### 4-1. 테스트 작성 (Red)
- [ ] `test/ir.parser.test.ts` 작성 — 3 케이스:
  1. 단순 헤더 + 본문
  2. inline HTML 보존
  3. frontmatter 추출 + 본문 분리
- [ ] `npm run test` 실행 → Fail 확인 (parser 없음)
- [ ] Commit: `test(spec-01-01): add failing tests for IR parser`

### 4-2. 구현 (Green)
- [ ] `src/ir/parser.ts` 작성:
  - `SceneMeta`, `SceneIR` 타입 export
  - frontmatter 분리 (정규식)
  - markdown-it 으로 본문 → HTML
  - `<section>` 으로 감싸서 `sections` 배열에 push
- [ ] `npm run test` 실행 → 3 케이스 모두 PASS
- [ ] `./.harness-kit/bin/sdd test passed` 호출 (테스트 통과 기록)
- [ ] Commit: `feat(spec-01-01): implement minimal IR parser`

---

## Task 5: viewer 통합 + Hello World 동작

### 5-1. viewer.ts 에 scene 로드 + parser 호출 추가
- [ ] `src/viewer.ts` 수정:
  - `/scenes/hello.md` fetch
  - `parseScene(md)` 호출
  - 결과를 `#slides` 에 innerHTML 로 주입
  - Reveal init

### 5-2. 수동 검증 — Phase 시나리오 1 PASS
- [ ] `npm run dev` → `http://localhost:5173` 접속
- [ ] hello scene 의 제목 / 본문 / inline HTML grid 정상 렌더링
- [ ] DOM inspector 로 `display: grid` 가 보존됨 확인
- [ ] 콘솔 에러 0개 확인
- [ ] 스크린샷 1장 캡처 (walkthrough 첨부용)
- [ ] `Ctrl+C` 종료

### 5-3. Commit
- [ ] Commit: `feat(spec-01-01): wire IR parser to viewer for hello world`

---

## Task 6: Ship

> 모든 작업 task 완료 후 `/hk-ship` 절차를 따릅니다.

- [ ] **타입 체크**: `npm run build` (tsc) 에러 0건
- [ ] **전체 테스트**: `npm run test` PASS (`./.harness-kit/bin/sdd test passed` 갱신)
- [-] (Integration Test Required = no — 수동 시나리오 1 로 갈음)
- [ ] **walkthrough.md 작성** — 결정 기록 / 사용자 협의 / 검증 결과 / 스크린샷 / 발견 사항
- [ ] **pr_description.md 작성** — 템플릿 준수
- [ ] **Ship Commit**: `docs(spec-01-01): ship walkthrough and pr description`
- [ ] **Push**: `git push -u origin spec-01-01-bootstrap-viewer`
- [ ] **PR 생성**: `gh pr create` (사용자 `[Y/n]` 확인 후)
- [ ] **사용자 알림**: 푸시 완료 + PR URL 보고

---

## 진행 요약

| 항목 | 값 |
|---|---|
| **총 Task 수** | 6 (Pre-flight 별도) |
| **예상 commit 수** | 8 (chore / ADR-001 / ADR-002 / scaffold / test red / parser green / viewer wire / ship) |
| **현재 단계** | Planning |
| **마지막 업데이트** | 2026-05-10 |
