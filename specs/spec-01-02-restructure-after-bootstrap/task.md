# Task List: spec-01-02

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

## Task 1: 브랜치 + ADR-003

### 1-1. feature 브랜치 생성
- [x] `git checkout -b spec-01-02-restructure-after-bootstrap`
- [x] Commit: 없음 (브랜치 생성만)

### 1-2. ADR-003 작성
- [x] `docs/decisions/ADR-003-repository-structure.md` 작성:
  - Status / Context / Decision / Consequences / Alternatives
  - 결정 4가지 (구조 / pnpm / 미래 React 자리 / ADR-002 와의 관계)
  - 거부 대안 trade-off 표
- [x] Commit: `docs(spec-01-02): add ADR-003 repository structure (studio container + pnpm)`

### 1-3. spec / plan / task pre-flight 산출물 add
- [x] `git add specs/spec-01-02-restructure-after-bootstrap/{spec,plan,task}.md`
- [x] 위 commit 에 묶거나, 별 chore commit 으로 처리. **결정**: ADR commit 에 같이 묶지 않고 별 chore commit (Task 1-2 와 분리하여 단일 책임 commit 유지)
- [x] Commit: `chore(spec-01-02): add spec/plan/task scaffolds`

---

## Task 2: npm → pnpm 전환

### 2-1. corepack 으로 pnpm 활성
- [x] `corepack enable` 실행
- [x] `corepack prepare pnpm@latest --activate`
- [x] `pnpm --version` 으로 활성 확인

### 2-2. `package-lock.json` 삭제
- [x] `rm package-lock.json`

### 2-3. `package.json` 의 `packageManager` 필드 추가
- [x] `package.json` 에 `"packageManager": "pnpm@<version>"` 추가
- [x] 기존 위치 (root) 그대로 — 다음 task 에서 studio/ 로 이동

### 2-4. (이 task 의 commit 은 다음 task — Task 3 — 의 mv 와 묶임)
- [x] commit 단독 분리 안 함. 이유: pnpm-lock 생성은 *studio/* 안에서 해야 의미 있음. Task 3 의 mv + Task 4 의 install 이 한 흐름.

> **Note**: Task 2 는 *준비* 단계라 commit 없음. Task 3 의 commit 에 `package-lock.json` 삭제 + `packageManager` 필드 변경이 함께 들어감.

---

## Task 3: `studio/` 컨테이너 이동 (git mv)

### 3-1. studio/ 디렉토리 생성 + 파일 이동
- [x] `mkdir studio`
- [x] `git mv package.json studio/package.json`
- [x] `git mv tsconfig.json studio/tsconfig.json`
- [x] `git mv vite.config.ts studio/vite.config.ts`
- [x] `git mv src studio/src`
- [x] `git mv public studio/public`
- [x] `git mv test studio/test`
- [x] `dist/` 가 있으면 `rm -rf dist` (gitignored)
- [x] `node_modules/` 는 `rm -rf node_modules` (gitignored — pnpm 으로 다시 install)

### 3-2. 경로 갱신 (필요 시)
- [x] `studio/vite.config.ts` 의 `resolve(__dirname, ...)` 경로 점검 — `__dirname` 이 `studio/` 가 되므로 그대로 동작 예상. 검증은 Task 4 build/test 단계.
- [x] `studio/tsconfig.json` 의 `include` 그대로 OK 확인.

### 3-3. Commit
- [x] `git add studio/ package-lock.json` (lock 삭제 + mv 일괄)
- [x] Commit: `refactor(spec-01-02): move all code into studio/ container`

---

## Task 4: pnpm install + build / test 검증

### 4-1. pnpm install
- [x] `cd studio && pnpm install`
- [x] `pnpm-lock.yaml` 생성 확인

### 4-2. build / test 검증
- [x] `pnpm run build` → tsc + vite build PASS (에러 0건)
- [x] `pnpm run test` → Vitest 3/3 PASS
- [x] `./.harness-kit/bin/sdd test passed` 호출 (project root 에서)

### 4-3. dev 서버 동작 확인 (수동)
- [x] `pnpm run dev` 백그라운드 → curl 200 + `/scenes/hello.md` 200 → 정지

### 4-4. Commit
- [x] `git add studio/pnpm-lock.yaml studio/package.json` (packageManager 필드 변경)
- [x] Commit: `chore(spec-01-02): switch to pnpm (lockfile generated)`

---

## Task 5: Playwright 헤드리스 재검증

### 5-1. Playwright 일회성 설치 + 검증 스크립트
- [x] `cd studio && pnpm install --no-save playwright`
- [x] `pnpm exec playwright install chromium` (또는 캐시 재사용)
- [x] `studio/.verify-hello.mjs` 작성 (이전 spec 과 동일 패턴, 출력 path 만 새 스크린샷 위치로):
  - `SCREENSHOT = '../specs/spec-01-02-restructure-after-bootstrap/screenshot-hello-after.png'`
  - 7 체크 (title / h1 / 본문 / 왼쪽 칸 / display:grid / 2칸 / 콘솔 에러 0)
- [x] dev 서버 백그라운드 실행 → `node ./.verify-hello.mjs` → 7/7 PASS

### 5-2. 검증 스크립트 정리 + 새 스크린샷 add
- [x] `rm studio/.verify-hello.mjs`
- [x] dev 서버 정지

### 5-3. Commit
- [x] `git add specs/spec-01-02-restructure-after-bootstrap/screenshot-hello-after.png`
- [x] Commit: `test(spec-01-02): re-verify scenario 1 after restructure (playwright headless)`

---

## Task 6: phase-01.md 본문 재배치

### 6-1. 본문 spec 번호 갱신
- [x] 기존 spec-01-02 (네비) → spec-01-03 으로 본문 갱신
- [x] 기존 spec-01-03 (애니) → spec-01-04
- [x] 기존 spec-01-04 (PDF) → spec-01-05
- [x] 기존 spec-01-05 선택 (MD 파서) → spec-01-06 선택
- [x] 새 spec-01-02 (본 spec) 항목 추가
- [x] 통합 테스트 시나리오 / 위험 표 / Phase Done 조건 의 spec 참조 번호 갱신
- [x] sdd 자동 갱신 영역 (`<!-- sdd:specs:* -->`) 은 그대로 둠

### 6-2. Commit
- [x] `git add backlog/phase-01.md`
- [x] Commit: `docs(spec-01-02): renumber phase-01 specs after restructure`

---

## Task 7: README / docs/planning 디렉토리 트리 갱신

### 7-1. README 보강
- [x] `README.md` 에 *프로젝트 구조* 섹션 추가 (4줄 정도 간단 트리 — `studio/`, `specs/`, `backlog/`, `docs/`)

### 7-2. docs/planning.md 보강
- [x] §2 Phase 정의 의 산출물 / 디렉토리 언급 부분에 "코드는 studio/ 안" 명시 (Phase 1 만 우선)

### 7-3. Commit
- [x] `git add README.md docs/planning.md`
- [x] Commit: `docs(spec-01-02): reflect studio/ structure in README and planning`

---

## Task 8: Ship

> 모든 작업 task 완료 후 `/hk-ship` 절차를 따릅니다.

- [x] **타입 체크**: `cd studio && pnpm run build` 에러 0건
- [x] **전체 테스트**: `cd studio && pnpm run test` PASS
- [-] (Integration Test Required = no — Playwright 시나리오 1 PASS 로 갈음)
- [x] **walkthrough.md 작성** — 결정 / 사용자 협의 / 검증 결과 / 새 스크린샷 / 발견 사항
- [x] **pr_description.md 작성** — 템플릿 준수
- [x] **Ship Commit**: `docs(spec-01-02): ship walkthrough and pr description`
- [x] **Push**: `git push -u origin spec-01-02-restructure-after-bootstrap`
- [x] **PR 생성**: `gh pr create` (사용자 `[Y/n]` 확인 후)
- [x] **사용자 알림**: 푸시 완료 + PR URL 보고

---

## 진행 요약

| 항목 | 값 |
|---|---|
| **총 Task 수** | 8 (Pre-flight 별도) |
| **예상 commit 수** | 9 (ADR / scaffolds / mv / pnpm / playwright / phase-01 / README&planning / ship / finalize) |
| **현재 단계** | Ship |
| **마지막 업데이트** | 2026-05-10 |
