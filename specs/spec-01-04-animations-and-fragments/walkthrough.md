# Walkthrough: spec-01-04-animations-and-fragments

> 본 문서는 *작업 기록* 입니다.

## 📌 결정 기록

| 이슈 | 선택지 | 결정 | 이유 |
|---|---|---|---|
| Transition 명세 | phase-01.md 의 `slide-up` / Reveal 표준 | **Reveal 표준 (`fade/slide/zoom/...`)** | 변환 layer 불필요. 사용자 합의로 phase-01.md 의 추정명을 정정. |
| Fragment 컨벤션 | (a) `<li class="fragment">` HTML class / (b) `<!-- .fragment -->` MD 주석 / (c) frontmatter | **(a) HTML class** | Reveal 표준. parser/loader 변경 0. MD inline HTML 친화. |
| `data-transition` 주입 위치 | viewer / **loader / parser** | **`loader.ts`** | Reveal API 미호출 = 격리 *근사*. 키 이름은 Reveal 컨벤션 — *부분 위반* 인지. |
| `transition` 잘못된 값 | 그대로 / 무시 | **무시 (undefined 유지)** | 화이트리스트 검증 — 잘못된 값으로 Reveal 동작이 깨지는 걸 막음. |
| PDF 호환 CSS 위치 | 별 CSS 파일 / **인라인 `<style>`** | **인라인** | spec-01-04 는 *사전* 만 — 본격 분리는 spec-01-05. 단순함 유지. |
| Playwright 시나리오 분할 | 한 스크립트 / 분리 | **한 스크립트, 10 체크** | transition (3) + fragment (6) + 콘솔 (1) — 한번에 검증이 효율적. |

## 💬 사용자 협의

- **주제**: spec-01-04 alignment
  - **사용자 의견**: "ㅛ" (Y — 추천 그대로)
  - **합의**: slug `animations-and-fragments`, Fragment = HTML class, Transition = frontmatter, Reveal 표준 명, loader 에서 `data-transition` 주입.

## 🧪 검증 결과

### 1. 자동화 테스트

#### 단위 테스트 (Vitest)
- **명령**: `cd studio && pnpm run test`
- **결과**: ✅ 11/11 PASS
  - parser: 5 (3 회귀 + 2 신규: transition 추출 / 무효값 무시)
  - loader: 6 (4 회귀 + 2 신규: data-transition 있음/없음)

#### 타입 체크 + 빌드
- **결과**: ✅ tsc + vite build PASS, JS gzip **78.15 kB** (이전 77.95 → +0.20 kB).
- **첫 시도 실패**: TS strict `noUnusedParameters` 가 `loader.ts` 의 `(s, i)` 의 `i` 미사용을 잡음 → `(s)` 만 받도록 수정 후 PASS.

#### Playwright 헤드리스 검증
- **결과**: ✅ 10/10 PASS
  ```text
  ✓ scene 1 data-transition: zoom
  ✓ scene 2 data-transition: slide
  ✓ scene 3 data-transition: fade
  ✓ scene 3 fragment 총 3개: 3
  ✓ 초기 fragment.visible = 0
  ✓ → 1회 후 visible = 1
  ✓ → 2회 후 visible = 2
  ✓ → 3회 후 visible = 3
  ✓ → 더 → visible 유지 = 3
  ✓ console errors: 0
  ```
- **스크린샷**: `screenshot-fragments-all.png` — scene 3 의 fragment 3개 모두 등장 + JSONL 코드 블록 + 한글 정상.

### 2. 수동 검증

1. **scene 전환 차이**: zoom → slide → fade — dev 서버 + 사람 눈으로 확인 가능 (자동화로도 `data-transition` 속성 검증).
2. **fragment 등장**: scene 3 도달 → → 키마다 페이드인 — 자동화 PASS.
3. **회귀**: 기존 9 테스트 (parser 3 + loader 4 = 7 + 미적용 시점 추가분) 그대로 유지.

## 🔍 발견 사항

- **Bash cwd 일관성 문제**: 여러 Bash 호출 사이 cwd 가 *때로는 root, 때로는 studio* 로 불규칙. `pnpm add -D playwright` 가 한번 root 에서 실행되어 root 에 `package.json` + `pnpm-lock.yaml` 잔재. 발견 후 정리 (rm). 향후 Playwright 검증 패턴은 항상 명시적으로 `cd studio` 또는 `pnpm --dir studio` 사용 필요.
- **root `node_modules/` 잔재 정리 권한 차단**: 사용자 권한 정책. `.gitignore` 에 의해 git 추적 안 되므로 PR 영향 없음. 사용자가 별도로 정리 권장.
- **`data-transition` 격리 정책 부분 위반**: `loader.ts` (Reveal 비종속 영역) 가 Reveal 의 컨벤션 키 (`data-transition`) 를 알고 있음. 향후 (d) 플러그인 / (c) 자체 viewer 이주 시 영향 = viewer.ts + loader.ts 두 곳 (이전엔 viewer.ts 1 곳). ADR-002 의 격리 정책에 *근사 격리* 로 기록.
- **TS strict `noUnusedParameters`** 가 `(s, i)` 패턴을 잡음 — 미래에 인덱스가 정말 필요해지면 `_i` 또는 `// eslint-disable-next-line` 고려.
- **Reveal 의 fragment 동작이 안정적**: → 키 마다 정확히 1개씩 등장, 마지막 fragment 후엔 다음 scene 으로 넘어가지 않음 (마지막 scene 이라). Phase 시나리오 2 의 fragment 부분 충족.

## 🚧 이월 항목

- 없음. PDF 본격 작업은 spec-01-05 — 본 spec 은 *사전 CSS* 만.
- root `node_modules/` 정리 — 사용자 직접.

## 📅 메타

| 항목 | 값 |
|---|---|
| **작성자** | Agent (Opus 4.7) + dennis |
| **작성 기간** | 2026-05-10 |
| **본 ship 직전 commit** | `1ffbb56` |
| **총 commit 수** | 8 (scaffolds / parser test / parser impl / loader test / loader impl / scenes+css / playwright / planning) |
