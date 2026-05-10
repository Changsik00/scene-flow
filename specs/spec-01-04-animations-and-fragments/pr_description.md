# feat(spec-01-04): scene 전환 애니메이션 + Fragment 등장

## 📋 Summary

### 배경 및 목적

spec-01-03 까지 다중 scene 네비는 동작하지만, 모든 scene 이 default transition + fragment 부재. Phase-01 시나리오 2 의 *애니메이션 + fragment* 충족이 본 spec 의 책임. 또한 scene-flow 만의 **frontmatter `transition` 컨벤션** 과 **`<li class="fragment">` 컨벤션** 을 공식 채택.

### 주요 변경 사항

- [x] **`SceneMeta.transition` 타입 + parser 추출** (Reveal 표준 6 값 + 화이트리스트 검증)
- [x] **`loader.ts` 에 `data-transition` 주입** — `<section data-transition="..."></section>` (Reveal 비종속 *근사* — 키 이름이 Reveal 컨벤션이라 *부분 위반* 인지)
- [x] **샘플 scene 3장 갱신** — 1=zoom / 2=slide / 3=fade + scene 3 에 `<li class="fragment">` 3개 (자막 sync / scene 재렌더링 / 챕터 자동)
- [x] **PDF 호환 사전 CSS** — `@media print { .fragment { opacity: 1; visibility: visible; } }` 인라인 스타일 (spec-01-05 출발점)
- [x] **단위 테스트 11개** — parser 5 (3 회귀 + 2 신규) + loader 6 (4 회귀 + 2 신규)
- [x] **Playwright 자동 검증 10/10 PASS** — transition 속성 (3) + fragment 등장 시퀀스 (6) + 콘솔 에러 0

### Phase 컨텍스트

- **Phase**: `phase-01` (Scene Engine)
- **본 SPEC 의 역할**: Phase-01 시나리오 2 의 애니/fragment 충족. spec-01-05 (PDF) 의 출발점 (CSS) 깔아둠.

## 🎯 Key Review Points

1. **Reveal 격리 정책 *근사 위반***: `loader.ts` 가 Reveal 컨벤션 (`data-transition`) 키 이름을 알고 있음. ADR-002 의 *완벽 격리* 가 아닌 *근사 격리*. 향후 (d) 플러그인 / (c) 자체 이주 시 영향 = viewer.ts + loader.ts 두 곳. 합리적 trade-off 인지 검토.
2. **Transition 매핑 — Reveal 표준 그대로**: phase-01.md 의 `slide-up` 추정명을 본 spec 에서 `slide` 로 정정. 별 매핑 layer 없이 단순. 이게 적절한지 검토.
3. **Fragment 컨벤션 = `<li class="fragment">`**: parser/loader 변경 0 이라는 비용 효율성. 단점: MD 친화 약함 (HTML 직접) — `<!-- .fragment -->` 같은 후처리 마커는 후속 spec 에서 도입 가능.
4. **잘못된 transition 값 무시**: `transition: invalid-value` 를 `undefined` 로 처리해 Reveal 동작이 안전. 단위 테스트 케이스 5 가 이를 보장.
5. **PDF 사전 CSS의 위치 (인라인 vs 별 파일)**: 본 spec 은 인라인 (1 줄). spec-01-05 가 본격 작업 시 별 CSS 파일로 분리할지 결정.
6. **발견 사항: cwd 일관성 문제**: walkthrough §발견 사항 에 기록. 향후 Playwright 검증 패턴은 명시적 `cd studio` / `pnpm --dir studio` 권장.

## 🧪 Verification

### 자동 테스트

```bash
cd studio
pnpm run test      # 11/11 PASS (parser 5 + loader 6)
pnpm run build     # tsc + vite build PASS
```

### Playwright 헤드리스

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
✓ 애니/fragment PASS
```

**스크린샷**: `specs/spec-01-04-animations-and-fragments/screenshot-fragments-all.png` — scene 3 fragment 3개 모두 등장 + JSONL 코드 블록 + 한글 정상.

## 📦 Files Changed

### 🆕 New Files

- `specs/spec-01-04-animations-and-fragments/{spec,plan,task,walkthrough,pr_description}.md`
- `specs/spec-01-04-animations-and-fragments/screenshot-fragments-all.png`

### 🛠 Modified Files

- `studio/src/ir/parser.ts` — `Transition` 타입 + frontmatter 추출 (+15 줄)
- `studio/src/scenes/loader.ts` — `withTransition` helper + 적용 (+5 줄)
- `studio/src/index.html` — `@media print` fragment 보임 CSS (+5 줄)
- `studio/src/scenes/01-hello.md` — `transition: zoom` 추가
- `studio/src/scenes/02-layered-model.md` — `transition: slide` 추가
- `studio/src/scenes/03-event-log.md` — `transition: fade` + fragment 3개 (인라인 HTML)
- `studio/test/ir.parser.test.ts` — +2 케이스
- `studio/test/scenes.loader.test.ts` — +2 케이스
- `docs/planning.md` — Phase 1 산출물에 transition / fragment 컨벤션 명시

**Total**: 6 new + 9 modified (코드 / 문서).

## ✅ Definition of Done

- [x] parser/loader 확장 + 11/11 단위 테스트 PASS
- [x] scene 3장 transition + scene 3 fragment 3개
- [x] PDF 호환 CSS 추가
- [x] Playwright 시나리오 A (transition) + B (fragment) PASS
- [x] 새 스크린샷
- [x] walkthrough.md / pr_description.md ship commit 예정
- [ ] PR 생성 + 사용자 검토 요청 (본 commit 직후)

## 🔗 관련 자료

- Phase: `backlog/phase-01.md`
- Spec: `specs/spec-01-04-animations-and-fragments/spec.md`
- Plan: `specs/spec-01-04-animations-and-fragments/plan.md`
- Walkthrough: `specs/spec-01-04-animations-and-fragments/walkthrough.md`
- ADR-002 격리 정책 (근사 위반 기록): `docs/decisions/ADR-002-render-engine.md`
