# Walkthrough: spec-01-05-pdf-print-output

> 본 문서는 *작업 기록* 입니다.

## 📌 결정 기록

| 이슈 | 선택지 | 결정 | 이유 |
|---|---|---|---|
| PDF 생성 메커니즘 | (a) Reveal `?print-pdf` / (b) headless 자동 / (c) decktape | **(a) `?print-pdf` (사용자 수동) + 자동 검증만 일회성** | Reveal 내장. 의존성 0. 사용자 1 step. |
| 자동화 CLI (`pnpm run pdf`) | 도입 / **미도입** | **미도입 (Out of Scope)** | 사용자 결정. 미래 phase / 별 spec. |
| **(검증 중 발견) Reveal v5 의 print-pdf CSS 가 Vite 환경에서 자동 로드 안 됨** | A. sass 추가 / B. 직접 작성 / C. 범위 축소 / D. decktape | **A. sass devDep 추가 + `pdf.scss` import** | 사용자 합의. Reveal v5 의 *공식 path* (소스 .scss 가 패키지에 포함). devDep 만 추가 (런타임 0 영향). plan.md 의 NFR §1 (의존성 0) 부분 수정 — walkthrough 에 사유 기록. |
| **(검증 중 발견) `@media print` 룰이 print-pdf 모드에 적용 안 됨** | 그대로 / `html.reveal-print` 셀렉터 추가 | **`html.reveal-print .fragment` 추가** | print-pdf 모드는 *runtime CSS 클래스 토글* 방식 (브라우저 미디어는 여전히 screen). `@media print` 는 *실제 인쇄 시* 만 적용 — 두 셀렉터 모두 두어 호환. |
| 검증 시나리오 | A 단순 / **A+B+C+page별 fragment 보임** | **A+B+C+8 체크** | 단순한 PASS 가 아니라 *실제 PDF 페이지에 fragment 가 어떻게 보이는지* 까지 검증. |
| @parcel/watcher build allow | 차단 / **허용** | **허용** | sass 의존성. pnpm-workspace.yaml 의 allowBuilds 에 추가. |

## 💬 사용자 협의

- **주제**: spec-01-05 alignment
  - **사용자 의견**: "ㅛ" (Y)
  - **합의**: slug `pdf-print-output`, Reveal `?print-pdf` 수동 + 자동 검증 일회성, PDF 본체 commit X / 페이지별 PNG 3장만.
- **주제**: 검증 중 발견 — Reveal v5 의 `?print-pdf` 가 Vite 환경에서 즉시 동작 안 함
  - **사용자 의견**: "ok" (A — sass 추가 추천 채택)
  - **합의**: sass devDep 추가 + `import 'reveal.js/css/print/pdf.scss'`. plan.md NFR §1 (의존성 0) 의 *부분 수정* — sass 는 빌드툴이라 런타임 영향 0.

## 🧪 검증 결과

### 1. 자동화 테스트

#### 단위 테스트 (Vitest)
- **명령**: `pnpm run test`
- **결과**: ✅ 11/11 회귀 PASS (parser 5 + loader 6) — 본 spec 은 코드 로직 변경 0 (CSS / SCSS import 만).

#### 타입 체크 + 빌드
- **결과**: ✅ tsc + vite build PASS, JS gzip **78.15 kB** (이전 동일), CSS gzip **12.91 kB** (이전 12.88 → +0.03 kB, pdf.scss 인라인 효과).

#### Playwright 헤드리스 검증 (8 체크)
- **결과**: ✅ **8/8 PASS**
  ```text
  ✓ default 모드 scene 수 = 3
  ✓ print-pdf 모드 활성 (html.reveal-print)
  ✓ PDF 페이지 수 ≥ 3 (실제 6)
  ✓ .pdf-page wrapper ≥ 3 (실제 6)
  ✓ 마지막 pdf-page 에 fragment 보임: 3
  ✓ scene 3 첫 pdf-page 에 fragment 모두 보임 (사전 CSS 효과): 3/3
  ✓ console errors (print 모드): 0
  ✓ console errors (default 모드): 0
  ```
- **PDF 페이지 6**: scene 1 (1) + scene 2 (1) + scene 3 (4 — fragment 1개당 1 페이지) = 6. 이게 Reveal print-pdf 의 default. 사전 CSS 의 `html.reveal-print .fragment { opacity:1 }` 보강으로 *모든 페이지에서* fragment 가 누적이 아닌 최종 상태로 보임.

### 2. 수동 검증

1. **dev 서버 동작**: `pnpm run dev` → 5174 fallback → HTTP 200.
2. **`?print-pdf` URL**: 직접 접속 시 모든 scene 이 펼쳐져 보임 (자동화로도 검증).
3. **자동 검증 결과 시각 확인**: `screenshot-pdf-page-{1,2,3}.png` 에서 각 scene 의 *첫 pdf-page* 가 정상 (fragment 모두 보임).

### 3. DOM 디버깅 발견 (검증 중)

- `.reveal .slides > section` 가 print-pdf 모드에선 *0개* (Reveal 가 section 들을 `.pdf-page` wrapper 로 옮김)
- `.pdf-page section` 으로 6개 (각 scene + fragment 페이지 추가)
- 해결: scene 수는 *default 모드에서* 측정, PDF 페이지 / fragment 검증은 *print 모드에서*. 두 페이지 (Playwright `Page`) 사용.

## 🔍 발견 사항

- **Reveal v5 의 print-pdf CSS 미배포 (소스 .scss 만)**: 공식 `?print-pdf` 동작이 Vite 등 모던 번들러 환경에서 *그대로는* 동작 안 함. sass 통합이 사실상 필수. 향후 사용자가 `pnpm install` 만으로 모든 게 동작하길 원한다면 본 spec 의 sass 추가가 정답.
- **`@media print` vs `html.reveal-print`**: 두 다른 적용 시점 — Cmd+P 인쇄 미디어 vs print-pdf 모드 클래스. fragment 처럼 *최종 상태* 를 강제하려는 룰은 *둘 다* 적용 필요.
- **PDF 페이지 수 = scene 수가 아님**: Reveal print-pdf 가 fragment 마다 페이지 추가 (default). 우리 사전 CSS 가 fragment 최종 상태를 모든 페이지에 보이게 해 의미적으로는 *각 scene 의 마지막 상태가 페이지마다 반복*. 사용자가 *페이지 수 = scene 수* 를 원한다면 Reveal `pdfMaxPagesPerSlide: 1` 옵션 또는 fragment 추출 로직 필요 — 후속 spec.
- **Bash cwd 일관성 문제 재발**: `pnpm --dir studio remove playwright` 가 cwd 가 이미 studio/ 일 때 `studio/studio` 를 찾으려 함. `--dir` 와 `cwd` 가 충돌. 향후 검증 패턴은 *cwd 명확화* 후 `pnpm` 만 사용.
- **package.json 부분 수정**: sass 추가 외에 plan.md 의 NFR §1 (의존성 0) 가 깨짐 — *예상된 deviation*, walkthrough 결정 기록에 명시.

## 🚧 이월 항목

- **PDF 페이지 수 = scene 수 모드** — `pdfMaxPagesPerSlide: 1` 또는 fragment 추출 옵션 (사용자가 *각 scene 1 페이지 만* 원할 경우). 본 spec 은 *Reveal default 동작* 으로 충분하다 보고 처리 안 함.
- **자동화 CLI (`pnpm run pdf`)** — 별 spec 또는 phase-3 (Composition) 에서 검토.

## 📅 메타

| 항목 | 값 |
|---|---|
| **작성자** | Agent (Opus 4.7) + dennis |
| **작성 기간** | 2026-05-10 |
| **본 ship 직전 commit** | `7422f96` |
| **총 commit 수** | 4 (scaffolds / print-pdf 통합 / 검증 / README) — ship + finalize 추가 예정 |
