# feat(spec-01-03): 다중 scene 네비게이션 (디렉토리 자동 발견)

## 📋 Summary

### 배경 및 목적

`spec-01-01` 의 viewer 는 단일 scene (`hello.md`) 만 표시. Phase-01 의 시나리오 2 (다중 scene 네비) 를 만족하려면 *여러 scene* 이 viewer 에 들어와야 함. 본 spec 은 **scene 디렉토리 자동 발견** 메커니즘 (사용자 합의 옵션 c) 으로 이를 해결하고, Reveal 의 내장 키보드 / hash / 풀스크린 동작이 동일하게 살아있는지 자동 검증.

### 주요 변경 사항

- [x] **scene 위치 이동**: `studio/public/scenes/` → `studio/src/scenes/` (Vite `import.meta.glob` 표준 자리)
- [x] **scene 파일 ≥3장**: `01-hello.md` (이름 변경), `02-layered-model.md`, `03-event-log.md` (비전 컨셉 시연)
- [x] **`studio/src/scenes/loader.ts`** 신규 — Reveal 비종속 순수 함수 (정렬 + 평탄화)
- [x] **`viewer.ts`** 갱신 — `import.meta.glob` 으로 scene 자동 수집 + loader 호출 + 다중 section 주입 + `loop: false`
- [x] **단위 테스트 (Vitest)** — `loader.ts` 4 케이스 (정렬 / 평탄화 / 빈 입력 / frontmatter 보존)
- [x] **Playwright 헤드리스 자동 검증** — 9/9 PASS (scene 1 → 2 → 3 → 정지 + URL hash + 풀스크린)
- [x] **새 스크린샷 2장** — scene 1 / scene 2 (시각 증거)
- [x] **README / docs/planning** 디렉토리 트리 + Phase 1 산출물 갱신

### Phase 컨텍스트

- **Phase**: `phase-01` (Scene Engine)
- **본 SPEC 의 역할**: phase-01 시나리오 2 의 *다중 scene 네비게이션* 충족. `loader.ts` 패턴은 후속 spec (spec-01-04 애니, 05 PDF) 의 viewer 통합 기준이 됨.

## 🎯 Key Review Points

1. **Reveal 격리 정책 유지** (`docs/decisions/ADR-002`): viewer.ts 만 Reveal API 호출. `loader.ts` / `parser.ts` 둘 다 Reveal 비종속 — 향후 (d) 플러그인 / (c) 자체 viewer 이주 시 영향 viewer.ts 1 곳에 격리됨이 코드로 증명되는지 검토.
2. **scene 자동 발견의 건강성**: `import.meta.glob('./scenes/*.md', { query: '?raw', eager: true })` 가 build / dev 양쪽에서 동일 동작. scene 추가 비용 = 파일 1개 추가만 — 검토.
3. **`loader.ts` 단위 테스트 케이스**: 정렬 / 평탄화 / 빈 입력 / frontmatter 보존 — 이게 *충분히 회귀 보호* 하는지. (특히 frontmatter 보존은 phase-2 Event Log 가 IR 메타에 의존하기 시작할 때 중요.)
4. **Playwright `waitForFunction` 패턴**: Reveal 의 hash 갱신이 비동기 + 한 박자 늦음. `waitForTimeout` 으로는 불안정 — `waitForFunction` 이 표준이 되어야 한다는 발견 사항이 후속 spec 의 검증 패턴에 잘 전파될지.
5. **headless chromium 풀스크린 동작**: 의외로 정상 동작 (`document.fullscreenElement === HTML`). 후속 spec 의 풀스크린 의존 검증 (예: PDF 출력에서 fullscreen mode 차이) 에 활용 가능.

## 🧪 Verification

### 자동 테스트

```bash
cd studio
pnpm run test      # Vitest — parser 3 + loader 4 = 7/7 PASS
pnpm run build     # tsc + vite build PASS
```

### Playwright 헤드리스 검증 (일회성)

```text
✓ document title: Hello scene-flow
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

**스크린샷**: `screenshot-scene-1.png` (Hello), `screenshot-scene-2.png` (Layered Overlay).

## 📦 Files Changed

### 🆕 New Files

- `studio/src/scenes/loader.ts` — 정렬 + 평탄화 (14 줄)
- `studio/src/scenes/02-layered-model.md`, `studio/src/scenes/03-event-log.md` — 데모 scene 2장
- `studio/test/scenes.loader.test.ts` — 4 케이스 단위 테스트
- `specs/spec-01-03-multi-scene-navigation/{spec,plan,task,walkthrough,pr_description}.md`
- `specs/spec-01-03-multi-scene-navigation/screenshot-scene-{1,2}.png`

### 🛠 Modified Files

- `studio/src/viewer.ts` — `fetch` 제거, `import.meta.glob` + loader 통합, `loop: false`
- `README.md` — `studio/src/scenes/` 트리 보강
- `docs/planning.md` — Phase 1 산출물에 loader / 자동 발견 명시

### 🔁 Renamed (git mv)

- `studio/public/scenes/hello.md` → `studio/src/scenes/01-hello.md` (100% similarity)

**Total**: 5 new + 3 modified + 1 renamed.

## ✅ Definition of Done

- [x] scene ≥3장, viewer 자동 수집, loader 분리
- [x] 단위 테스트 7/7 PASS
- [x] Playwright 자동 검증 9/9 PASS (풀스크린 포함)
- [x] 새 스크린샷 2장
- [x] README / planning 갱신
- [x] walkthrough.md / pr_description.md ship commit 예정
- [ ] PR 생성 + 사용자 검토 요청 (본 commit 직후)

## 🔗 관련 자료

- Phase: `backlog/phase-01.md`
- Spec: `specs/spec-01-03-multi-scene-navigation/spec.md`
- Plan: `specs/spec-01-03-multi-scene-navigation/plan.md`
- Walkthrough: `specs/spec-01-03-multi-scene-navigation/walkthrough.md`
- ADR-002 격리 정책: `docs/decisions/ADR-002-render-engine.md`
