# Walkthrough: spec-01-02-restructure-after-bootstrap

> 본 문서는 *작업 기록* 입니다. 결정 / 사용자 협의 / 검증 결과를 남깁니다.

## 📌 결정 기록

| 이슈 | 선택지 | 결정 | 이유 |
|---|---|---|---|
| 최상위 디렉토리 정리 | (a) 현 상태 / (b) src→studio rename / **(c) 거버넌스 + 진입점 + studio/ 3 평면** / (d) packages/studio monorepo / (e) 지금 React+Tailwind+shadcn+FSD | **(c)** | 첫 진입자 명료 + 확장성 + 이주 비용 균형. ADR-003. |
| 패키지 매니저 | npm / **pnpm** | **pnpm** | disk efficient + monorepo 친화 + 사용자 명시 결정. corepack 활성. |
| dev 명령 위치 | root thin wrapper / **`cd studio`** | **`cd studio && pnpm run dev`** | 단일 패키지 단계엔 wrapper 불필요. multi-package 가 진짜 필요해지면 그때 도입. |
| 이동 방식 | `mv` / **`git mv`** | **`git mv`** | rename 추적 → blame / log 보존. 100% similarity 로 추적됨 (실제 커밋 결과 확인). |
| 미래 React/Tailwind/shadcn/FSD 도입 시점 | 지금 / **phase-3/4** | **phase-3/4 (자리만 ADR-003 에 명시)** | 오버엔지니어링 회피. phase-1 의 hello world 검증 단계에 디버깅 표면적 키우면 본질 (IR/Event Log) 결정이 흐려짐. |
| esbuild build script 차단 | (a) 무시 / **(b) `pnpm-workspace.yaml` 의 `allowBuilds.esbuild: true`** + package.json 의 `pnpm.onlyBuiltDependencies` | **(b)** | pnpm 11 의 strict 모드 default. esbuild 는 표준 도구라 명시 허용이 정답. |
| Playwright 재검증 방식 | npm `--no-save` / pnpm dlx / **`pnpm add -D` + `pnpm remove`** | **add+remove** | pnpm 은 `--no-save` 미지원. add-then-remove + git restore 필요 시 — 본 spec 에선 add 후 검증 후 remove 만으로 충분 (lockfile 자동 복원, package.json 의 sole 변경은 pnpm 자동 reformat). |
| Vite/TS 경로 갱신 | 명시 / **`__dirname` 자동 상대경로** | **자동** | `vite.config.ts` 가 `resolve(__dirname, ...)` 사용 — `studio/` 안으로 옮기면 `__dirname` 가 자동으로 `studio/` 가 되어 경로가 *그대로 동작*. tsconfig include 도 `studio/` 기준 자동. |

## 💬 사용자 협의

- **주제**: 최상위 디렉토리 어수선함
  - **사용자 의견**: "현재 디렉토리 구성을 보니 package.json 이런게 최상위에 있어 src 도 있고.. specs, backlog 이런게 혼합되어 있어서 최상위를 정리 하다 보니 studio 개념이 생긴거야"
  - **합의**: 거버넌스 + 진입점 + `studio/` 3 평면 분리. ADR-003 으로 영구 기록.
- **주제**: 결국 React 로 발전하는가
  - **사용자 의견**: "그러면서 html 을 결국 react 로 만들거 아니냐는 결론으로 이른거야"
  - **합의**: 비전상 React/Tailwind/shadcn/FSD 들어올 자리 있음. 단 *지금* 도입은 오버엔지니어링. ADR-003 에 *자리만 명시*, 적정 시점은 phase-3/4 (studio 가 multi-feature GUI 가질 때).
- **주제**: spec ID 위치 (spec-x vs phase 안)
  - **사용자 의견**: "현재 phase 에 넣어서 진행 하되 spec 번호가 꼬인거지? 이전 spec 번호에 후속조치로 넣는 slug 하면 되지 않을까?"
  - **합의**: phase-01 안의 spec-01-02 로. slug `restructure-after-bootstrap` (후속조치 의미 명시). 기존 phase-01.md 본문의 spec-01-02 (네비) ~ 05 (MD 파서) 는 03~06 으로 재배치.
- **주제**: 패키지 매니저
  - **사용자 의견**: "npm 이 아니라 pnpm 으로 했으면 좋겠어"
  - **합의**: pnpm 채택. corepack 으로 활성.
- **주제**: 오버엔지니어링 자가질문
  - **사용자 의견**: "이건 오버엔지니어링 인건가?"
  - **합의**: pnpm + studio/ + ADR-003 = 합리. 지금 React+Tailwind+shadcn+FSD+front.md 모두 도입 = 오버엔지니어링. 비전은 ADR 자리만, 스택은 적정 시점에.

## 🧪 검증 결과

### 1. 자동화 테스트

#### 단위 테스트 (Vitest)

- **명령**: `cd studio && pnpm run test`
- **결과**: ✅ Passed (3/3, 4ms)
- **케이스**: 단순 헤더+본문 / inline HTML 보존 / frontmatter 추출 — restructure 전과 동일

#### 타입 체크 + 빌드 (Vite)

- **명령**: `cd studio && pnpm run build`
- **결과**: ✅ Passed
- 산출: `studio/dist/` (gzip JS 76.82 kB — 이전과 동일 크기)

#### Playwright 헤드리스 시나리오 1

- **결과**: ✅ 7/7 PASS
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
- **스크린샷**: `specs/spec-01-02-restructure-after-bootstrap/screenshot-hello-after.png` — *spec-01-01 의 스크린샷과 시각적으로 동일* (restructure 가 동작에 영향 없음을 시각 증명).

### 2. 수동 검증

1. **최상위 깔끔성**: `ls scene-flow/` → `README.md` `CLAUDE.md` `.gitignore` `studio/` `specs/` `backlog/` `docs/` (+ ignored). 한눈에 들어옴.
2. **dev 서버 동작**: `cd studio && pnpm run dev` → 5174 fallback (5173 점유) → HTTP 200, hello.md 200.
3. **git mv 추적 확인**: `git log --follow studio/src/viewer.ts` 가 spec-01-01 의 `d6347a4` (`src/viewer.ts` 시점) 까지 이어짐 — rename 100% 추적.
4. **package.json reformat**: `pnpm add playwright` → `pnpm remove playwright` 사이클에서 `pnpm.onlyBuiltDependencies` 가 한 줄 → 여러 줄로 자동 변경. 기능 동일. 본 commit (`ada78ca`) 에 묶음.
5. **phase-01.md 정합성**: 본문 (spec-01-02 (본 spec) / 03 (네비) / 04 (애니) / 05 (PDF) / 06 선택 (MD 파서)) 와 sdd 자동 갱신 영역 (spec 표 — 01/02 만 표시) 충돌 없음.
6. **README 디렉토리 트리**: 새 구조 4 디렉토리 + `cd studio && pnpm` 명령 안내 추가.
7. **docs/planning.md Open Questions**: §5.2 / §5.3 결정 완료 표시 + §5.5 (저장소 구조) 신설 + §5.6 (구 §5.5 PPT export) 번호 밀림.

## 🔍 발견 사항

- **pnpm 11 의 strict build script 모드** — `esbuild` 같은 표준 도구도 차단. `pnpm-workspace.yaml` 의 `allowBuilds` 또는 `package.json` 의 `pnpm.onlyBuiltDependencies` 로 명시 허용 필요. 향후 추가 의존성 (React 도입 시 등) 도 동일 패턴.
- **Vite 의 `__dirname` 기반 상대경로 설정** — 본 spec 처럼 *디렉토리 통째 이동* 시 자동으로 새 위치 기준 동작. 명시 절대 경로 안 쓴 게 결과적으로 잘한 결정 (이전 spec-01-01).
- **pnpm 자동 생성한 `pnpm-workspace.yaml`** — 단일 패키지인데도 esbuild build allow 를 위해 자동 생성됨. 향후 monorepo 분할 시 같은 파일 재사용 가능.
- **README 트리에 `node_modules / dist / .harness-kit / .claude`** 같은 ignored 디렉토리는 *표시 안 함* — 첫 진입자 인지 부담 줄임.

## 🚧 이월 항목

- 없음. 본 spec 의 Out of Scope 항목 (React/Tailwind/shadcn/FSD/front.md/monorepo 정식 분할/CI) 은 모두 미래 phase / spec 으로 의도된 분리.
- **esbuild moderate vuln** (이전 spec-01-01 의 발견 사항) 은 본 spec 에선 처리 안 함 — 별 spec-x 또는 phase-2 즈음 정리.

## 📅 메타

| 항목 | 값 |
|---|---|
| **작성자** | Agent (Opus 4.7) + dennis |
| **작성 기간** | 2026-05-10 |
| **본 ship 직전 commit** | `c2f47e4` |
| **총 commit 수** | 7 (ADR / scaffolds / mv / pnpm / playwright / phase-01 renumber / README&planning) — ship + finalize 가 추가될 예정 |
