# Implementation Plan: spec-01-01

## 📋 Branch Strategy

- 신규 브랜치: `spec-01-01-bootstrap-viewer` (브랜치 이름 = spec 디렉토리 이름, `feature/` prefix 없음)
- 시작 지점: `main`
- 첫 task 가 브랜치 생성을 수행함

## 🛑 사용자 검토 필요 (User Review Required)

> [!IMPORTANT]
> - [ ] **IR 결정**: Markdown + inline HTML — ADR-001 로 영구 기록
> - [ ] **렌더 엔진 결정**: Reveal.js 위에 얹기 — ADR-002 로 영구 기록 + 점진 이주 정책 명시
> - [ ] **빌드 스택**: Vite + TypeScript + Vitest + npm — 본 spec 에서 굳혀 phase-1 전체에 적용
> - [ ] **TypeScript strict mode ON** — 처음부터 엄격하게
> - [ ] **Prettier / ESLint 의도적 연기** — 가볍게 시작, 필요 시 별도 spec
> - [ ] **잔재 정리 한 commit 묶음** — 본 spec 의 첫 task (chore) 로 모두 처리
> - [ ] **CI / GitHub Actions 본 spec 범위 밖** — 별도 spec 또는 phase

> [!WARNING]
> - [ ] **node_modules / package-lock.json 신규** — `.gitignore` 에 `node_modules/` 추가, `package-lock.json` 은 commit
> - [ ] **Reveal.js 종속 → viewer 1곳에 격리** — IR 파서는 Reveal 비종속 (Reveal markup 문자열만 생성). 이주 시 영향 최소화.

## 🎯 핵심 전략 (Core Strategy)

### 아키텍처 컨텍스트

```mermaid
flowchart TD
    subgraph "Source"
        S[public/scenes/hello.md<br/>MD + inline HTML]
    end
    subgraph "src/ir (Reveal 비종속)"
        P[parser.ts<br/>parseScene&#40;md&#41; → SceneIR]
        IR[SceneIR<br/>'sections: string[]<br/>meta: SceneMeta'<br/>]
    end
    subgraph "src/viewer (Reveal 종속, 격리)"
        V[viewer.ts<br/>fetch + parser + Reveal.init]
    end
    subgraph "Render"
        R[Reveal.js<br/>browser]
    end
    S -->|fetch| V
    V -->|parseScene| P
    P -->|return| IR
    IR -->|inject DOM| V
    V -->|initialize| R
```

**핵심 원칙**:
- `src/ir/` 는 Reveal 을 모름. 입력 = MD 문자열, 출력 = Reveal markup 문자열 + 메타.
- `src/viewer.ts` 만 Reveal API 를 호출.
- 향후 (d) Reveal 플러그인 또는 (c) 자체 viewer 로 이주 시, `viewer.ts` 만 교체.

### 주요 결정

| 컴포넌트 | 결정 | 이유 |
|:---:|:---|:---|
| **Scene IR** | Markdown + inline HTML | 작성성 + 자유도 균형. Reveal/Marp/Slidev 도 같은 방식. AI 친화. (ADR-001) |
| **Render Engine** | Reveal.js 위에 얹기 | 키보드/애니/PDF 즉시 동작. phase-1 의 성공 기준 빠르게 충족. Event Log 후킹 어색해지면 (d) 플러그인으로 점진 이주. (ADR-002) |
| **Build** | Vite | ESM 네이티브, 빠른 dev server, Reveal 통합 사례 다수 |
| **언어** | TypeScript (strict) | phase-2 Event Log 에서 타입 안전성 결정적. 처음부터 strict 유지 비용이 더 작음. |
| **Test** | Vitest | Vite 와 자연 짝. JSDOM/Node 환경 둘 다 지원. |
| **MD 파서** | `markdown-it` | 가벼움, 플러그인 풍부, frontmatter 분리 단순 |
| **패키지 매니저** | npm | 가장 표준, 추가 도입 비용 0 |
| **Prettier/ESLint** | 본 spec 에서 도입 안 함 | 의도적 연기 — 필요해지는 시점에 별도 spec |
| **테마** | Reveal 기본 (`black` 또는 `white`) | 본 spec 의 핵심은 IR + viewer 동작. 테마는 후속 phase. |
| **CI** | 본 spec 범위 밖 | 별도 spec |

## 📂 Proposed Changes

### 잔재 정리 (Task 1)

#### [NEW] `.gitignore` (이미 작성된 것에 추가)
- 현재 내용: `.harness-kit/`, `.harness-backup-*/`, `.claude/state/`
- 추가: `node_modules/`, `dist/`, `.DS_Store`

#### [ADD] 기존 untracked 파일 — git add
- `backlog/queue.md`, `backlog/phase-01.md`
- `.gitignore`, `CLAUDE.md`
- `.claude/settings.json`, `.claude/commands/` (단, `.claude/state/` 는 ignore)
- `specs/spec-01-01-bootstrap-viewer/{spec,plan,task,walkthrough}.md`

### ADR (Task 2)

#### [NEW] `docs/decisions/ADR-001-scene-ir.md`

ADR 표준 양식 (Status / Context / Decision / Consequences / Alternatives). 핵심:

- **Decision**: Scene IR = Markdown + inline HTML
- **Context**: layered 모델의 base layer. 작성성과 자유도 균형 필요. AI 가 다루기 좋아야 함 (phase-4).
- **Consequences (positive)**: MD 의 가벼움 + HTML 의 자유도. 기존 Reveal/Marp 사용자에게 친숙. AI 친화.
- **Consequences (negative)**: DSL 만큼 검증 / 정형 분석은 어려움. 단, IR 위에 nested DSL 을 얹는 길은 열려 있음.
- **Alternatives**: (a) MD only, (c) HTML/MDX, (d) DSL → 각 trade-off

#### [NEW] `docs/decisions/ADR-002-render-engine.md`

- **Decision**: Reveal.js 위에 얹기
- **Context**: phase-1 목표 (단일/다중 scene, 애니, PDF) 가 Reveal 의 기본 기능과 1:1 매핑
- **Consequences (positive)**: 즉시 동작, 검증된 PDF 출력, 풍부한 생태계
- **Consequences (negative)**: 의존성, scene-flow 만의 Event Log 후킹 시 wrapper 1 겹
- **점진 이주 정책**: phase-2 에서 Event Log 후킹이 불편해지면 (d) Reveal 플러그인 형태 → 더 깊으면 (c) 자체 구현. IR 파서는 Reveal 비종속이라 이주 비용은 viewer 1 곳에 한정.
- **Alternatives**: (b) Remotion (발표 모드 약함), (c) 자체 (작업량 폭발 위험)

### 부트스트랩 (Task 3)

#### [NEW] `package.json`

```json
{
  "name": "scene-flow",
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "reveal.js": "^5.x",
    "markdown-it": "^14.x"
  },
  "devDependencies": {
    "vite": "^5.x",
    "typescript": "^5.x",
    "vitest": "^2.x",
    "@types/node": "^20.x",
    "@types/markdown-it": "^14.x"
  }
}
```

#### [NEW] `vite.config.ts`
- 기본 설정. `root` 는 `src/` (또는 root 에 `index.html` 둠 — 실제 위치는 구현 시 결정).

#### [NEW] `tsconfig.json`
- `strict: true`, `target: ES2022`, `module: ESNext`, `moduleResolution: bundler`.

#### [NEW] `src/index.html`
- 최소 — `<div class="reveal"><div class="slides" id="slides"></div></div>` + `<script type="module" src="./viewer.ts"></script>` + Reveal CSS link.

#### [NEW] `src/viewer.ts` (Task 3 시점에는 stub)
- 기본 골격: `Reveal.initialize({})` 호출만. scene 로드는 Task 5 에서.

#### [NEW] `public/scenes/hello.md`

```markdown
---
title: Hello scene-flow
---

# Hello, scene-flow

이것은 첫 scene 입니다.

<div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
  <div>왼쪽 칸 — inline HTML 보존 검증용</div>
  <div>오른쪽 칸</div>
</div>
```

### IR 파서 (Task 4 — TDD)

#### [NEW] `test/ir.parser.test.ts` (Red — Task 4-1)

3 케이스:
1. 단순 헤더 + 본문 (`# 제목\n\n내용`) → `<section><h1>제목</h1><p>내용</p></section>` 포함
2. inline HTML 보존 — 입력의 `<div class="grid">…</div>` 가 출력에도 그대로
3. frontmatter 추출 — `---\ntitle: foo\n---` 가 `meta.title === 'foo'` 로 파싱되고 본문엔 frontmatter 가 빠짐

#### [NEW] `src/ir/parser.ts` (Green — Task 4-2)

```typescript
export interface SceneMeta {
  title?: string;
  // 후속 spec 에서 확장 (transition, duration 등)
}
export interface SceneIR {
  sections: string[]; // Reveal markup 문자열 배열 (단일 scene 의 경우 길이 1)
  meta: SceneMeta;
}
export function parseScene(md: string): SceneIR { /* ... */ }
```

- frontmatter 파싱은 직접 (정규식 1개) — `gray-matter` 같은 추가 의존 안 도입.
- markdown-it 으로 본문 → HTML.
- `<section>` 으로 감싸서 sections[0] 에 push.

### viewer 통합 (Task 5)

#### [MODIFY] `src/viewer.ts`

```typescript
import Reveal from 'reveal.js';
import 'reveal.js/dist/reveal.css';
import 'reveal.js/dist/theme/black.css';
import { parseScene } from './ir/parser.ts';

const sceneUrl = '/scenes/hello.md';
const md = await fetch(sceneUrl).then(r => r.text());
const ir = parseScene(md);
const slides = document.getElementById('slides')!;
slides.innerHTML = ir.sections.join('\n');

const deck = new Reveal({ /* 기본 옵션 */ });
deck.initialize();
```

수동 검증: `npm run dev` → `http://localhost:5173` → hello scene 표시, inline HTML 의 grid 레이아웃이 깨지지 않음.

## 🧪 검증 계획 (Verification Plan)

### 단위 테스트

```bash
npm run test
```

기대: `test/ir.parser.test.ts` 의 3 케이스 PASS.

### 통합 테스트

해당 없음 (Integration Test Required = no). Phase-level 시나리오 1 의 *수동* 검증으로 갈음 — walkthrough 에 스크린샷 + 단계 기록.

### 수동 검증 시나리오

1. **빌드 / dev 서버 정상 실행**: `npm install` → `npm run dev` → `http://localhost:5173` 가 에러 없이 열림. 콘솔 에러 0개.
2. **Hello scene 표시**: 위 URL 에 hello scene 의 제목 / 본문 / inline HTML grid 가 정상 렌더링.
3. **inline HTML 보존 확인**: `display: grid` 두 칸 레이아웃이 깨지지 않음 (DOM inspector 로 확인).
4. **단위 테스트**: `npm run test` 의 3 케이스 모두 PASS.
5. **타입 체크**: `npm run build` (tsc) 가 에러 0건.
6. **잔재 정리**: `git status` 결과 — main 머지 후 clean (untracked / modified 0개).

## 🔁 Rollback Plan

- 본 spec 은 신규 파일 / 디렉토리 추가 위주. 문제 시 `git revert <merge commit>` 으로 즉시 원복.
- `node_modules/` 는 ignore 대상이라 영향 없음. `package-lock.json` 만 revert 하면 충분.
- 데이터 / 외부 시스템 영향 없음.

## 📦 Deliverables 체크

- [ ] task.md 작성 (다음 단계)
- [ ] 사용자 Plan Accept 받음
- [ ] (실행 후) 모든 task 완료
- [ ] (실행 후) ADR-001 / ADR-002 작성 완료
- [ ] (실행 후) IR 파서 단위 테스트 PASS
- [ ] (실행 후) 수동 시나리오 1 PASS + 스크린샷
- [ ] (실행 후) walkthrough.md / pr_description.md ship
