# feat(spec-01-01): bootstrap scene-engine — IR + render decisions + minimal viewer

## 📋 Summary

### 배경 및 목적

phase-01 (Scene Engine) 의 첫 spec. 비전 문서 (`docs/planning.md`) 에서 미결로 둔 두 결정 — *Scene IR 형식* 과 *렌더 엔진* — 을 ADR 로 굳히고, 그 결정 위에 hello scene 1장이 브라우저에 떠 layered 모델의 base layer 가 처음으로 *동작* 한다.

### 주요 변경 사항

- [x] **ADR-001 — Scene IR**: Markdown + inline HTML (대안 (a)/(c)/(d) trade-off 표 포함)
- [x] **ADR-002 — Render Engine**: Reveal.js 위에 얹기 + 점진 이주 정책 (Event Log 후킹 어색해지면 (d) 플러그인 → (c) 자체 viewer)
- [x] **프로젝트 부트스트랩**: Vite + TypeScript (strict) + Vitest + Reveal.js 5 + markdown-it
- [x] **IR 파서** (`src/ir/parser.ts`): MD + inline HTML → `<section>` markup. **Reveal 비종속** (출력은 markup 문자열만).
- [x] **viewer** (`src/viewer.ts`): `/scenes/hello.md` fetch → parser → `#slides` 주입 → Reveal init. **Reveal 종속을 본 파일에 격리**.
- [x] **Hello scene** (`public/scenes/hello.md`): frontmatter title + 본문 + inline HTML grid.
- [x] **시나리오 1 PASS**: Playwright 헤드리스 7/7 체크 통과 + 스크린샷 첨부.
- [x] **잔재 정리**: rebrand 머지 후 떠 있던 untracked 파일들 (queue.md, phase-01.md, .gitignore, CLAUDE.md, .claude/{settings,commands}) 첫 task 의 chore commit 으로 정리.

### Phase 컨텍스트

- **Phase**: `phase-01` (Scene Engine)
- **본 SPEC 의 역할**: 두 ADR 로 phase 의 모든 후속 spec 의 *기준점* 을 굳히고, base layer (IR + viewer) 의 최소 동작을 달성. spec-01-02 (네비게이션) 부터는 본 viewer 위에 얹힌다.

## 🎯 Key Review Points

1. **ADR 의 점진 이주 정책** (`docs/decisions/ADR-002-render-engine.md`) — Reveal 의 이벤트 모델이 phase-2 Event Log 와 1:1 매칭되지 않을 때의 다음 단계 ((d) → (c)) 가 명시되어 있는가. 이주 비용이 viewer.ts 1곳에 한정되도록 격리 정책 (parser 가 Reveal 비종속) 이 spec 에 반영되어 있는지 확인.
2. **IR 파서의 inline HTML 보존** (`src/ir/parser.ts` + `test/ir.parser.test.ts`) — markdown-it 의 `html: true` 옵션이 inline HTML 을 그대로 통과시키는지 테스트 케이스 2번이 검증. frontmatter 정규식이 다양한 입력을 안전하게 처리하는지 (현재 `title` 한 키만 처리, 후속 확장 여지) 검토.
3. **`@types/reveal.js` deviation** — plan.md 의 의존성 6개 + 1 (총 7개). 사용자 사전 합의 없이 자율 추가 — walkthrough §사용자 협의 에 사유 기록. 이 deviation 정도가 합리적인지 검토.
4. **Vite root = src/, publicDir = public/** — 프로젝트 root 와 분리. dev/build 모두 정상 (5174 fallback 동작). 후속 spec 에서 추가 페이지가 필요해질 때 이 구조가 견딜지 검토.
5. **잔재 정리의 한 commit 묶음** — 21 files / 2142 lines. 본 spec 의 핵심 작업과 분리해 첫 task chore 로 처리. git history 가깝게 봤을 때 "왜 이 PR 의 첫 commit 이 이렇게 큰가" 가 자연스럽게 보이는지 검토.

## 🧪 Verification

### 자동 테스트

```bash
npm run test     # Vitest — IR 파서 단위 테스트
npm run build    # tsc --noEmit && vite build
```

**결과 요약**:
- ✅ `test/ir.parser.test.ts`: 3/3 통과 (단순 / inline HTML / frontmatter)
- ✅ `tsc --noEmit`: 에러 0건
- ✅ `vite build`: 281ms, JS 205.13 kB (gzip 76.82 kB)

### Playwright 헤드리스 검증 (일회성)

`node ./.verify-hello.mjs` (검증 후 스크립트 삭제):

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

**스크린샷**: `specs/spec-01-01-bootstrap-viewer/screenshot-hello.png` — Reveal black 테마에 한국어 텍스트 + inline HTML 2칸 grid 가 정상 렌더링됨.

### 수동 검증 시나리오

1. `npm install` → 정상 (esbuild moderate vuln 5건은 dev server CORS 한정, 후속 spec 메모).
2. `npm run dev` → http://localhost:5174/ 응답 200, hello.md 200, viewer.ts 200, parser.ts 200.
3. 시나리오 1 (단일 scene 표시) Playwright 검증 → PASS + 스크린샷.

## 📦 Files Changed

### 🆕 New Files (코드 / 설정)

- `package.json`, `package-lock.json`, `vite.config.ts`, `tsconfig.json`
- `src/index.html`, `src/viewer.ts`, `src/ir/parser.ts`
- `public/scenes/hello.md`
- `test/ir.parser.test.ts`
- `docs/decisions/ADR-001-scene-ir.md`
- `docs/decisions/ADR-002-render-engine.md`

### 🆕 New Files (메타 / SDD)

- `backlog/queue.md`, `backlog/phase-01.md`
- `specs/spec-01-01-bootstrap-viewer/{spec,plan,task,walkthrough,pr_description}.md`
- `specs/spec-01-01-bootstrap-viewer/screenshot-hello.png`
- `.gitignore`, `CLAUDE.md`
- `.claude/settings.json`, `.claude/commands/*.md` (13 files)

### 🛠 Modified Files

- (없음 — 전부 신규 / 또는 잔재 정리에서 첫 add)

**Total**: ~40 files, +4000 lines / −0 (대부분 신규).

## ✅ Definition of Done

- [x] 단위 테스트 PASS (3/3)
- [x] 타입 체크 + 빌드 PASS
- [x] Phase 시나리오 1 수동 PASS (Playwright 헤드리스 + 스크린샷)
- [x] ADR-001 / ADR-002 작성 commit
- [x] 잔재 정리 commit
- [x] `walkthrough.md` / `pr_description.md` ship commit 예정
- [x] `spec-01-01-bootstrap-viewer` 브랜치 push 예정
- [ ] PR 생성 + 사용자 검토 요청 알림 (본 commit 직후)

## 🔗 관련 자료

- Phase: `backlog/phase-01.md`
- Spec: `specs/spec-01-01-bootstrap-viewer/spec.md`
- Plan: `specs/spec-01-01-bootstrap-viewer/plan.md`
- Walkthrough: `specs/spec-01-01-bootstrap-viewer/walkthrough.md`
- ADR-001: `docs/decisions/ADR-001-scene-ir.md`
- ADR-002: `docs/decisions/ADR-002-render-engine.md`
- 스크린샷 (검증 증거): `specs/spec-01-01-bootstrap-viewer/screenshot-hello.png`
