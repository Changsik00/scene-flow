# feat(spec-01-05): PDF 출력 (Reveal print-pdf 모드 통합)

## 📋 Summary

### 배경 및 목적

Phase-01 시나리오 3 (PDF 출력) 충족. Reveal v5 의 `?print-pdf` 모드를 Vite 환경에서 완전히 통합하고, 사용자가 `Cmd+P` → "PDF 로 저장" 만으로 깨끗한 PDF 를 뽑을 수 있게 한다. fragment 의 *최종 상태* 가 모든 PDF 페이지에 보이도록 사전 CSS 보강.

### 주요 변경 사항

- [x] **sass devDep 추가** — Reveal v5 의 `pdf.scss` 를 컴파일하기 위해 (런타임 영향 0)
- [x] **`viewer.ts` 에 `import 'reveal.js/css/print/pdf.scss'`** — print-pdf 모드 CSS 활성
- [x] **`@parcel/watcher` build allow** — sass 의존성, `pnpm-workspace.yaml` 에 명시
- [x] **사전 CSS 보강** (`studio/src/index.html`):
  - `@media print` (수동 인쇄) — 기존 spec-01-04
  - `html.reveal-print .fragment { opacity:1; visibility:visible }` (print-pdf 모드) — 신규
- [x] **README "PDF 출력" 섹션** — 사용자 가이드 (3 step)
- [x] **Playwright 자동 검증 8/8 PASS** — print-pdf 모드 / PDF 페이지 / fragment 보임 / 콘솔 에러 0
- [x] **페이지별 PNG 3장** commit (시각 증거)

### Phase 컨텍스트

- **Phase**: `phase-01` (Scene Engine)
- **본 SPEC 의 역할**: phase-01 마지막 spec — 시나리오 3 (PDF) 충족. 본 PR 머지 후 phase-01 의 모든 시나리오 (1/2/3) 완료 → `/hk-phase-ship` 가능.

## 🎯 Key Review Points

1. **sass devDep 추가 — plan.md NFR §1 (의존성 0) 의 부분 수정**: 검증 중 발견 — Reveal v5 의 print-pdf CSS 가 npm 패키지에 *컴파일된 형태로 없음* (`.scss` 소스만). sass 통합이 사실상 필수. 사용자 사전 합의 (옵션 A) 에 따른 *예상된 deviation*. walkthrough 의 결정 기록에 명시. 합리적인지 검토.
2. **사전 CSS 의 두 셀렉터 (`@media print` + `html.reveal-print`)**: 두 다른 적용 시점 (실제 인쇄 vs print-pdf 모드). 둘 다 두는 게 맞는지 — fragment 가 *모든 PDF 페이지* 에 보이는 게 의도된 동작인지.
3. **PDF 페이지 수 6 ≠ scene 수 3**: Reveal print-pdf 의 default 동작 — fragment 1개당 1 페이지 추가. 사전 CSS 가 fragment 최종 상태를 모든 페이지에 보이게 함. 사용자가 *페이지 수 = scene 수* 를 원한다면 별 spec (`pdfMaxPagesPerSlide: 1` 옵션 또는 fragment 추출 모드) — 본 spec 은 default 동작 채택.
4. **viewer.ts 변경 = import 1줄**: ADR-002 격리 정책 유지 — Reveal API 호출 변경 없음, CSS import 만.
5. **검증 패턴의 재사용 가능성**: `?print-pdf` URL + `page.pdf()` + `.pdf-page` wrapper 분석은 후속 phase (특히 phase-3 Composition) 에서 다시 활용 가능.

## 🧪 Verification

### 자동 테스트

```bash
cd studio
pnpm run test      # 11/11 회귀 PASS (parser 5 + loader 6)
pnpm run build     # tsc + vite build PASS, JS 78.15kB / CSS 12.91kB
```

### Playwright 헤드리스 (8 체크)

```text
✓ default 모드 scene 수 = 3
✓ print-pdf 모드 활성 (html.reveal-print)
✓ PDF 페이지 수 ≥ 3 (실제 6)
✓ .pdf-page wrapper ≥ 3 (실제 6)
✓ 마지막 pdf-page 에 fragment 보임: 3
✓ scene 3 첫 pdf-page 에 fragment 모두 보임 (사전 CSS 효과): 3/3
✓ console errors (print 모드): 0
✓ console errors (default 모드): 0
✓ PDF 출력 PASS
```

### 수동 검증 시나리오 (사용자)

README 의 "PDF 출력" 섹션 그대로 따라 가능:
1. `cd studio && pnpm run dev`
2. `http://localhost:5173/?print-pdf`
3. `Cmd+P` → "PDF 로 저장"

## 📦 Files Changed

### 🆕 New Files

- `specs/spec-01-05-pdf-print-output/{spec,plan,task,walkthrough,pr_description}.md`
- `specs/spec-01-05-pdf-print-output/screenshot-pdf-page-{1,2,3}.png`

### 🛠 Modified Files

- `studio/package.json` — sass devDep 추가
- `studio/pnpm-lock.yaml` — sass 잠금
- `studio/pnpm-workspace.yaml` — `@parcel/watcher: true` (sass 의존성)
- `studio/src/viewer.ts` — `import 'reveal.js/css/print/pdf.scss'` 1줄 추가
- `studio/src/index.html` — `html.reveal-print .fragment` 보강 CSS
- `README.md` — "PDF 출력" 섹션 신설

**Total**: 8 new + 6 modified.

## ✅ Definition of Done

- [x] `?print-pdf` 모드 자동 검증 (시나리오 A/B/C) PASS
- [x] 페이지별 스크린샷 3장 commit
- [x] PDF 호환 CSS 보강 (`html.reveal-print` 셀렉터)
- [x] README "PDF 출력" 섹션 추가
- [x] 회귀 테스트 11/11 PASS, build PASS
- [x] walkthrough.md / pr_description.md ship commit 예정
- [ ] PR 생성 + 사용자 검토 요청 (본 commit 직후)

## 🔗 관련 자료

- Phase: `backlog/phase-01.md`
- Spec: `specs/spec-01-05-pdf-print-output/spec.md`
- Plan: `specs/spec-01-05-pdf-print-output/plan.md`
- Walkthrough: `specs/spec-01-05-pdf-print-output/walkthrough.md`
- 사전 CSS 의 출발: `spec-01-04-animations-and-fragments` (PR #5)
