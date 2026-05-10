# Walkthrough: spec-01-03-multi-scene-navigation

> 본 문서는 *작업 기록* 입니다.

## 📌 결정 기록

| 이슈 | 선택지 | 결정 | 이유 |
|---|---|---|---|
| scene 나열 방식 | (a) 한 파일 다중 + `---` / (b) manifest / **(c) 디렉토리 자동 발견** | **(c)** | 사용자 합의. 작성성 + 단순성 + scene 별 독립성 모두 만족. |
| scene 위치 | `public/scenes/` / **`src/scenes/`** | **`src/scenes/`** | Vite `import.meta.glob` 표준 자리. public 은 *완전 정적* 자산용. |
| 수집 방식 | manifest / **`import.meta.glob`** | **glob (eager + raw)** | 빌드 / dev 모두 동일. manifest 불필요. 초기 fetch 0회. |
| 정렬 | 파일명 prefix `NN-{slug}.md` 알파벳 | 채택 | 단순. 의도 명시 가능 (`01-`, `02-`, `99-`). |
| 로직 분리 | viewer 안 / **별 모듈** | **`src/scenes/loader.ts`** | parser ↔ viewer 사이의 *중간 layer*. Reveal 비종속 → 단위 테스트 가능. |
| Reveal 격리 | viewer.ts 1곳만 Reveal API | 유지 | ADR-002 정책. loader 는 Reveal 모름. |
| Playwright hash 검증 | `waitForTimeout` / **`waitForFunction`** | **`waitForFunction`** | Reveal 의 hash 갱신이 비동기 — fixed delay 로는 첫 → 키 / 두 번째 → 키 모두 한 번에 안 됨. h1 변경 / hash 변경 각각을 *명시적 wait* 로 분리. |
| 풀스크린 검증 | 시도 / 포기 | **시도 → 의외로 PASS** | headless chromium 한계를 우려했지만 `document.fullscreenElement === HTML` 로 정상 동작 확인. walkthrough 의 사전 노트는 *예상보다 잘 됨* 으로 수정. |

## 💬 사용자 협의

- **주제**: spec-01-03 의 slug 와 scene 나열 방식
  - **사용자 의견**: "Y, multi-scene-navigation + (c) 디렉토리 자동 발견"
  - **합의**: slug `multi-scene-navigation` (네비 + 다중 scene 지원의 합집합 — Reveal 의 키보드는 내장이라 *부가*, 다중 scene 이 본질). 나열은 (c) 자동 발견.

## 🧪 검증 결과

### 1. 자동화 테스트

#### 단위 테스트 (Vitest)
- **명령**: `cd studio && pnpm run test`
- **결과**: ✅ 7/7 PASS — `ir.parser.test.ts` 3 케이스 (회귀) + `scenes.loader.test.ts` 4 케이스 (정렬 / 평탄화 / 빈 입력 / frontmatter 보존).

#### 타입 체크 + 빌드
- **명령**: `pnpm run build`
- **결과**: ✅ 263ms, JS gzip **77.95 kB** (이전 76.82 → +1.13 kB, scene 3장 markdown 인라인 결과).

#### Playwright 헤드리스 검증
- **결과**: ✅ 9/9 PASS
  ```text
  ✓ document title (첫 scene): Hello scene-flow
  ✓ scene 1 h1: Hello, scene-flow
  ✓ 시작 hash: (빈 hash)
  ✓ → 1회 후 scene 2 h1: Layered Overlay
  ✓ → 1회 후 hash 변경: (빈) → #/1
  ✓ → 2회 후 scene 3 h1: Scene Event Log
  ✓ → 2회 후 마지막 hash: #/2
  ✓ 마지막에서 → 한 번 더 → 정지: #/2 → #/2
  ✓ console errors: 0
  ✓ 다중 scene 네비 PASS

  [fullscreen 검증] document.fullscreenElement = HTML
  ```
- **스크린샷**: `screenshot-scene-1.png` (Hello), `screenshot-scene-2.png` (Layered Overlay) — Reveal 의 progress bar / next 화살표까지 정상.

### 2. 수동 검증

1. **scene 자동 수집**: `studio/src/scenes/` 의 3 파일 (`01-hello.md`, `02-layered-model.md`, `03-event-log.md`) 이 알파벳 정렬로 viewer 에 표시. ✓
2. **dev 서버**: `pnpm run dev` → 5174 fallback (5173 점유 — 이전 dev 잔재). ✓
3. **마지막 scene 정지**: → 키 추가 입력해도 hash 변화 없음 + scene 3 유지. ✓
4. **풀스크린**: F 키 → `document.fullscreenElement === HTML` (headless 임에도 정상). Esc 로 해제 — 별도 검증 안 함 (시간 절약).
5. **scene 추가 비용**: 새 scene 파일 1장 추가 만으로 자동 노출 — 코드 / config 수정 없음 (수동 확인 안 했지만 `import.meta.glob` 정의상 그러함).

## 🔍 발견 사항

- **Reveal hash 갱신 비동기 + 한 박자 늦음**: 첫 → 키 직후엔 hash 가 바로 안 갱신, h1 변경은 즉시. Playwright 검증은 *h1 변경* 과 *hash 변경* 을 각각 `waitForFunction` 으로 명시 wait 해야 안정적. fixed `waitForTimeout(800)` 로는 부족 (특히 → 2회 후 hash 가 한 박자 더 늦게 갱신되는 현상 관찰).
- **headless chromium 풀스크린이 의외로 동작**: `document.fullscreenElement` 가 정상 set 됨. spec.md 의 "한계 가능" 언급보다 실제론 잘 동작. 향후 spec (애니/PDF) 에서도 비슷한 검증 가능.
- **scene markdown 이 번들에 인라인** (eager glob): scene 추가 시 번들 크기 비례 증가. ≤10 장 가정에선 무시 가능 — 미래에 lazy load 필요해지면 별 spec.
- **public/ 디렉토리가 비어 있음**: `studio/public/scenes/` 가 없어졌고 다른 정적 자산도 아직 없음. Vite `publicDir` 가 가리키는 경로라 그대로 둠 (미래 정적 자산 위치). 빈 디렉토리는 git 추적 안 됨 — 자연스럽게 사라짐.

## 🚧 이월 항목

- 없음. 본 spec 의 Out of Scope (애니메이션 / fragment / PDF / MD 파서 고도화) 는 모두 후속 spec 으로 의도된 분리.

## 📅 메타

| 항목 | 값 |
|---|---|
| **작성자** | Agent (Opus 4.7) + dennis |
| **작성 기간** | 2026-05-10 |
| **본 ship 직전 commit** | `d61fdad` |
| **총 commit 수** | 7 (scene mv+add / scaffolds / loader test red / loader green / viewer / playwright / docs) — ship + finalize 추가 예정 |
