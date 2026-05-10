# Walkthrough: spec-01-01-bootstrap-viewer

> 본 문서는 *작업 기록* 입니다. 결정 / 사용자 협의 / 검증 결과를 남깁니다.

## 📌 결정 기록

| 이슈 | 선택지 | 결정 | 이유 |
|---|---|---|---|
| Scene IR 형식 | (a) MD only / **(b) MD + inline HTML** / (c) HTML/MDX / (d) DSL | **(b)** | 작성성 + 자유도 균형. AI 친화. Reveal/Marp/Slidev 표준. ADR-001 로 영구 기록. |
| Render Engine | **(a) Reveal.js 위에 얹기** / (b) Remotion / (c) 자체 / (d) Reveal 플러그인 | **(a)** | phase-1 성공 기준 즉시 충족, PDF 검증된 동작. Event Log 후킹 어색해지면 (d) → (c) 점진 이주. ADR-002. |
| Build / Lang | Vite + TS + Vitest | 채택 | Vite/Reveal 통합 사례 다수, ESM 네이티브. TS strict 로 phase-2 Event Log 타입 안전성 미리 확보. |
| MD 파서 | `markdown-it` | 채택 | 가벼움, plugin 풍부, frontmatter 분리 단순. |
| Prettier / ESLint | 의도적 연기 | 보류 | 첫 spec 가볍게. 필요해지는 시점에 별도 spec. |
| Reveal 종속 격리 | viewer.ts 1 파일에 한정 | 채택 | 향후 (d) 플러그인 / (c) 자체 이주 시 영향 viewer.ts 1곳에 한정. |
| 시나리오 1 검증 | 사용자 수동 vs Playwright 자동 | **Playwright 일회성** | 사용자 요청. devDep 추가 없이 `--no-save` 로 검증, 끝나면 정리. 결과는 스크린샷 + 7/7 체크 로 commit. |
| `@types/reveal.js` 추가 | (a) 정식 devDep / (b) 자체 .d.ts | **(a)** | TS strict 통과 + 후속 phase-2 의 Reveal 이벤트 후킹 자동완성. plan.md 명시 외 deviation 1건 — 매우 작아 자율 처리. |
| `.ts` 확장자 import | 유지 / 제거 | **제거** | `tsc` strict 가 차단. Vite 는 자동 resolve 라 영향 없음. |

## 💬 사용자 협의

- **주제**: 비전 / 스펙 분할
  - **합의**: phase-1 첫 spec 으로 IR + 렌더 결정 + 최소 viewer + 잔재 정리를 묶음 (B 옵션). 각 phase 가 독립 가치를 가지는 layered 모델 유지.
- **주제**: IR 결정
  - **합의**: Markdown + inline HTML — ADR-001 로 영구 기록.
- **주제**: 렌더 엔진 결정
  - **합의**: Reveal.js — ADR-002 로 영구 기록 + 점진 이주 정책 명시.
- **주제**: 시나리오 1 검증 방식
  - **사용자 의견**: "너가 e2e 로 chrome 못 접근해?"
  - **합의**: Playwright 일회성 검증으로 진행 (`--no-save`, 검증 후 정리). 본 spec 의 "E2E 자동 테스트 Out of Scope" 정책은 *devDep 으로 정식 도입* 을 가리키고, 일회성 npx 사용은 정책과 충돌하지 않음.
- **주제**: `@types/reveal.js` deviation
  - **합의**: 사용자 사전 합의 없이 자율 추가 — 사유: type safety 보장을 위한 사소한 fix, plan.md 의 NFR §2 (TS strict) 이 강제하는 자연스러운 결과. walkthrough 에 기록.

## 🧪 검증 결과

### 1. 자동화 테스트

#### 단위 테스트

- **명령**: `npm run test` (Vitest)
- **결과**: ✅ Passed (3/3 in 4ms)
- **로그 요약**:
  ```text
  ✓ test/ir.parser.test.ts (3 tests) 4ms
  Test Files  1 passed (1)
        Tests  3 passed (3)
  ```
- **케이스**:
  1. 단순 헤더 + 본문 → `<section><h1>제목</h1>…</section>`
  2. inline HTML 보존 (`<div class="grid">…</div>`)
  3. frontmatter 추출 + 본문 분리

#### 타입 체크 / 빌드

- **명령**: `npm run build` (`tsc --noEmit && vite build`)
- **결과**: ✅ Passed
- 산출: `dist/index.html` + `dist/assets/index-*.{js,css}` (gzip JS 76.82 kB)

#### Playwright 헤드리스 검증 (일회성)

- **명령**: `node ./.verify-hello.mjs` (검증 후 스크립트 삭제)
- **결과**: ✅ 7/7 PASS
  ```text
  ✓ document title: Hello scene-flow
  ✓ h1 text: Hello, scene-flow
  ✓ body 본문 포함: 있음
  ✓ 왼쪽 칸 텍스트: 있음
  ✓ .grid-demo display: grid
  ✓ .grid-demo columns: 2칸 (472px 472px)
  ✓ console errors: 0
  ✓ 시나리오 1 PASS
  ```
- **스크린샷**: `specs/spec-01-01-bootstrap-viewer/screenshot-hello.png` (1280×720, devicePixelRatio 2)

### 2. 수동 검증

1. **Action**: `npm install` 실행
   - **Result**: 57 packages added, esbuild 5건 moderate vuln (dev server CORS, vite 8 점프 필요 — 본 spec 범위 밖, 후속 spec 에 메모).
2. **Action**: `npm run dev`
   - **Result**: VITE v5.4.21 ready (5173 점유 → 5174 fallback). HTTP 200. `/scenes/hello.md`, `/viewer.ts`, `/src/ir/parser.ts` 모두 200.
3. **Action**: 첫 build 시 `tsc` 에러 3건 (reveal.js 타입 / .ts 확장자 import 2건)
   - **Result**: `@types/reveal.js` devDep 추가 + `.ts` 확장자 제거 후 PASS. 별 chore commit 으로 분리.

## 🔍 발견 사항

- **vite 5 → 8 점프가 필요한 esbuild moderate vuln 5건** — dev server CORS 한정, 운영 영향 없음. 후속 phase 또는 별도 spec 에서 정리 (예: `spec-x-deps-bump`).
- **Reveal 의 `slidechanged` 등 이벤트 모델이 phase-2 Event Log 의 fragment 타이밍과 1:1 매칭되는지**는 phase-2 첫 spec 에서 검증 필요. 결과에 따라 ADR-002 의 점진 이주 정책 트리거 가능.
- **`tsc` 의 `.ts` 확장자 import 정책**이 Vite 와 충돌 — 향후 import 작성 시 `.ts` 빼는 컨벤션 굳힘. lint rule 도입 시 강제 가능 (Prettier/ESLint 도입 spec 에서).
- **Korean 텍스트가 Reveal black 테마에서 자연스럽게 렌더링**됨 — 별도 폰트 import 없이 OS default 로 충분 (스크린샷 확인). 후속 디자인 spec 에서 한글 폰트 (Pretendard 등) 도입 검토.

## 🚧 이월 항목

- 없음. 본 spec 의 Out of Scope 항목 (네비게이션 / 애니메이션 / PDF / MD 파서 고도화) 은 모두 phase-01 의 후속 spec (spec-01-02 ~ spec-01-04 / 선택 spec-01-05) 에서 처리.
- 발견 사항의 esbuild vuln 은 별도 spec-x 후보로 메모 (`backlog/queue.md` Icebox 또는 `대기 Phase` 섹션에 추가 가능 — 우선순위 낮음).

## 📅 메타

| 항목 | 값 |
|---|---|
| **작성자** | Agent (Opus 4.7) + dennis |
| **작성 기간** | 2026-05-10 |
| **본 ship 직전 commit** | `f94979b` |
| **총 commit 수** | 8 (chore / ADR-001 / ADR-002 / scaffold / test red / parser green / viewer wire / type fix) |
