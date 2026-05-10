# refactor(spec-01-02): bootstrap 후속 — 저장소 구조 정리 (studio + pnpm)

## 📋 Summary

### 배경 및 목적

`spec-01-01-bootstrap-viewer` (PR #2) 머지 후 main 의 최상위 디렉토리에 *코드 / 거버넌스 / 진입점* 이 한 평면에 섞여 있었다. PR #2 review 도중 사용자와 다음을 합의:

- **`studio/` 컨테이너로 코드 묶기** — 거버넌스 (specs/ backlog/ docs/) 와 분리
- **npm → pnpm** — disk efficient + monorepo 친화
- **미래 React/Tailwind/shadcn/FSD/front.md** — *지금* 도입 안 함 (오버엔지니어링 회피). ADR-003 에 자리만.

본 PR 은 이 결정을 한 단위 PR 로 처리.

### 주요 변경 사항

- [x] **ADR-003 작성** — 저장소 구조 (3 평면) + pnpm + 미래 React 자리 + ADR-002 점진 이주와의 관계
- [x] **`git mv`** 로 모든 코드 → `studio/` 안 (rename 100% 추적, blame / log 보존)
- [x] **npm → pnpm 전환** — `package-lock.json` 삭제, `pnpm-lock.yaml` 생성, `corepack` 활성, `packageManager` 필드 명시
- [x] **esbuild build script 명시 허용** — `studio/pnpm-workspace.yaml` + `studio/package.json` 의 `pnpm.onlyBuiltDependencies`
- [x] **Playwright 헤드리스 시나리오 1 PASS** — restructure 후에도 동일 동작 + 새 스크린샷
- [x] **`backlog/phase-01.md` 본문 재배치** — 네비 → spec-01-03, 애니 → 04, PDF → 05, MD 파서 → 06 (선택)
- [x] **README / docs/planning** 디렉토리 트리 + 결정 상태 갱신

### Phase 컨텍스트

- **Phase**: `phase-01` (Scene Engine)
- **본 SPEC 의 역할**: spec-01-01 의 *bootstrap 후속* — 저장소 구조와 패키지 매니저, 미래 도입 정책을 ADR 로 굳혀 다음 spec (네비 / 애니 / PDF) 들이 깨끗한 구조 위에서 시작하도록 함.

## 🎯 Key Review Points

1. **ADR-003 의 "비전은 ADR, 스택은 적정 시점" 원칙** — `docs/decisions/ADR-003-repository-structure.md` 의 "미래 도입 자리만 명시" 표가 *오버엔지니어링 회피* 의 정책을 명확히 표현하는지. 향후 phase-3/4 의 React 도입 spec 이 본 표를 출발점으로 삼을 수 있는지 검토.
2. **`git mv` rename 추적 보존** — `git log --follow studio/src/viewer.ts` 가 spec-01-01 의 `d6347a4` (`src/viewer.ts` 시점) 까지 이어지는지. blame 도 동일하게 보존되는지.
3. **시각적 동일성 증명** — `screenshot-hello-after.png` 가 spec-01-01 의 `screenshot-hello.png` 와 *시각적으로 동일* — 즉 본 PR 이 *동작* 에 영향이 없음을 시각 증명. (한국어 폰트 / 그리드 / Reveal black 테마 모두 보존.)
4. **pnpm strict build allow 정책** — `pnpm-workspace.yaml` + `package.json` 의 두 위치에 esbuild 허용을 적은 게 적절한지. 향후 추가 도구 (React 등) 도입 시 같은 패턴이 잘 확장될지.
5. **phase-01.md 본문 재배치 정합성** — sdd 자동 갱신 영역 (spec-01-01 / 02 만 표시) 과 본문 (01 ~ 06) 사이 충돌 없는지. 시나리오 / 위험 표의 spec 참조 번호 모두 갱신됐는지.
6. **`cd studio && pnpm` 명령 패턴** — README 의 안내가 명확한지. 향후 root 에 thin wrapper 가 필요해지는 트리거를 ADR 이 명시했는지.

## 🧪 Verification

### 자동 테스트

```bash
cd studio
pnpm run test      # Vitest — IR 파서 단위 테스트 (3/3)
pnpm run build     # tsc --noEmit && vite build (gzip 76.82 kB, 이전과 동일)
```

**결과 요약**:
- ✅ `test/ir.parser.test.ts`: 3/3 통과 (단순 / inline HTML / frontmatter)
- ✅ `tsc --noEmit`: 에러 0건
- ✅ `vite build`: 263ms

### Playwright 헤드리스 검증 (일회성)

```text
✓ document title: Hello scene-flow
✓ h1 text: Hello, scene-flow
✓ body 본문 포함: 있음
✓ 왼쪽 칸 텍스트: 있음
✓ .grid-demo display: grid
✓ .grid-demo columns: 2칸 (472px 472px)
✓ console errors: 0
✓ 시나리오 1 PASS (after restructure)
```

**스크린샷**: `specs/spec-01-02-restructure-after-bootstrap/screenshot-hello-after.png` — spec-01-01 의 `screenshot-hello.png` 와 시각적으로 동일.

### 수동 검증 시나리오

1. **최상위 깔끔성**: `ls scene-flow/` → README + CLAUDE + .gitignore + studio/ + specs/ + backlog/ + docs/ — 한눈에 의도 파악 가능. ✓
2. **`git mv` 추적**: `git log --follow studio/src/viewer.ts` 이전 commit 까지 이어짐. ✓
3. **dev 서버**: `cd studio && pnpm run dev` → 5174 fallback → HTTP 200 / hello.md 200. ✓
4. **phase-01.md 정합성**: spec 표 (sdd 자동) ↔ 본문 (수동 재배치) 충돌 0. ✓

## 📦 Files Changed

### 🆕 New Files

- `docs/decisions/ADR-003-repository-structure.md`
- `studio/pnpm-lock.yaml`, `studio/pnpm-workspace.yaml`
- `specs/spec-01-02-restructure-after-bootstrap/{spec,plan,task,walkthrough,pr_description}.md`
- `specs/spec-01-02-restructure-after-bootstrap/screenshot-hello-after.png`

### 🛠 Modified Files

- `backlog/phase-01.md` — spec 본문 재배치 + ADR-003 추가 + 위험 표 갱신
- `README.md` — 프로젝트 구조 섹션 신설 + 현재 상태 갱신 + ADR 링크
- `docs/planning.md` — Phase 1 산출물에 `studio/` 명시 + Open Questions §5.2 / §5.3 결정 완료 표시 + §5.5 (저장소 구조) 신설

### 🔁 Renamed (git mv — 100% similarity)

- `package.json` → `studio/package.json`  *(이후 `packageManager` 필드 + `pnpm.onlyBuiltDependencies` 추가)*
- `tsconfig.json` → `studio/tsconfig.json`
- `vite.config.ts` → `studio/vite.config.ts`
- `src/index.html` → `studio/src/index.html`
- `src/viewer.ts` → `studio/src/viewer.ts`
- `src/ir/parser.ts` → `studio/src/ir/parser.ts`
- `public/scenes/hello.md` → `studio/public/scenes/hello.md`
- `test/ir.parser.test.ts` → `studio/test/ir.parser.test.ts`

### 🗑 Deleted Files

- `package-lock.json` — npm 산출물, pnpm 으로 갈아탐.

**Total**: 8 renamed (rename 100%) + 8 new + 3 modified + 1 deleted.

## ✅ Definition of Done

- [x] ADR-003 작성 + commit
- [x] pnpm 전환 + lockfile 생성 + esbuild build allow
- [x] 모든 코드 `studio/` 안
- [x] `pnpm run build` PASS
- [x] `pnpm run test` PASS (3/3)
- [x] Playwright 헤드리스 시나리오 1 PASS + 새 스크린샷
- [x] phase-01.md 본문 재배치
- [x] README / docs/planning 디렉토리 트리 + 결정 상태 갱신
- [x] walkthrough.md / pr_description.md ship commit 예정
- [x] 브랜치 push 예정
- [ ] PR 생성 + 사용자 검토 요청 알림 (본 commit 직후)

## 🔗 관련 자료

- Phase: `backlog/phase-01.md`
- Spec: `specs/spec-01-02-restructure-after-bootstrap/spec.md`
- Plan: `specs/spec-01-02-restructure-after-bootstrap/plan.md`
- Walkthrough: `specs/spec-01-02-restructure-after-bootstrap/walkthrough.md`
- ADR-003: `docs/decisions/ADR-003-repository-structure.md`
- 이전 spec: PR #2 (spec-01-01-bootstrap-viewer) — 본 spec 의 base
