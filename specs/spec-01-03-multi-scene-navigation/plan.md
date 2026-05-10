# Implementation Plan: spec-01-03

## 📋 Branch Strategy

- 신규 브랜치: `spec-01-03-multi-scene-navigation`
- 시작 지점: `main` (PR #3 머지 직후)
- 첫 task 가 브랜치 생성

## 🛑 사용자 검토 필요 (User Review Required)

> [!IMPORTANT]
> - [ ] **scene 나열 방식 = 디렉토리 자동 발견 (옵션 c)** — 사용자 합의됨
> - [ ] **scene 위치 = `studio/src/scenes/`** (Vite `import.meta.glob` 표준)
> - [ ] **정렬 컨벤션 = 파일명 prefix `NN-{slug}.md`** (알파벳 정렬)
> - [ ] **`hello.md` → `01-hello.md`** 이름 변경 (prefix 적용)
> - [ ] **scene 파일 추가 ≥2** (총 3장 이상 — 네비 시연용)
> - [ ] **풀스크린 자동 검증의 한계 인정** — headless chromium 에서 *완전한* fullscreen 은 안 될 수 있음. 가능한 만큼 검증 + walkthrough 에 사유 기록.

> [!WARNING]
> - [ ] **scene 파일 위치 변경**: `public/scenes/` → `src/scenes/`. fetch 경로가 사라지고 모듈 import 로 전환 — 향후 외부 도구 (예: 사용자가 별도로 scene 파일을 삽입하는 시나리오) 와의 호환성 영향. 단, 현 시점엔 그런 외부 통합 없음.
> - [ ] **build 시 모든 scene 이 번들에 포함** — 매우 큰 deck (수백 장) 시 번들 비대해짐. 본 spec 에선 우려 없음 (≤10 장 가정), 미래에 lazy load 필요해지면 별 spec.

## 🎯 핵심 전략 (Core Strategy)

### 아키텍처 컨텍스트

```mermaid
flowchart TD
    subgraph "studio/src/scenes/"
        F1[01-hello.md]
        F2[02-...md]
        F3[03-...md]
    end

    subgraph "studio/src/scenes/loader.ts (Reveal 비종속)"
        G[import.meta.glob<br/>raw 텍스트 수집]
        SORT[키 정렬]
        PARSE[parseScene 호출]
        FLAT[sections 평탄화]
        OUT[loadAllScenes&#40;&#41;:<br/>'sections: string[]<br/>scenes: SceneIR[]'<br/>]
        G --> SORT --> PARSE --> FLAT --> OUT
    end

    subgraph "studio/src/viewer.ts (Reveal 종속)"
        V[loadAllScenes&#40;&#41; 호출]
        I[#slides 에 sections 주입]
        R[new Reveal&#40;...&#41;.initialize&#40;&#41;]
        V --> I --> R
    end

    F1 -.glob.-> G
    F2 -.glob.-> G
    F3 -.glob.-> G
    OUT --> V
```

### 주요 결정

| 컴포넌트 | 결정 | 이유 |
|:---:|:---|:---|
| **scene 위치** | `studio/src/scenes/` | Vite `import.meta.glob` 의 표준 자리. public/ 은 *완전 정적* 자산용. |
| **수집 방식** | `import.meta.glob('./scenes/*.md', { query: '?raw', import: 'default', eager: true })` | 빌드 / dev 모두 동일 동작. manifest 불필요. eager 라 초기 1회 fetch 없음 — 즉시 사용 가능. |
| **정렬** | 파일 경로 알파벳 (`Object.keys(modules).sort()`) | 단순. prefix 컨벤션 (`NN-`) 으로 의도 명시 가능. |
| **frontmatter `order` 키** | 본 spec 범위 밖 | 파일명 prefix 가 1차. `order` 는 후속 spec 에서 도입 (필요 시). |
| **로직 분리 위치** | `studio/src/scenes/loader.ts` | parser 와 viewer 사이의 *중간 layer*. Reveal 비종속. 단위 테스트 가능. |
| **Reveal 격리 유지** | viewer.ts 만 Reveal API | ADR-002 정책. loader 는 Reveal 모름. |
| **scene 파일 ≥3장** | `01-hello.md`, `02-architecture.md`, `03-pipeline.md` (제목 후보, 실제는 작업 중 결정) | 다중 scene 네비를 검증 가능한 최소 수. 내용은 단순 — phase-1 은 viewer 검증이 본질. |
| **풀스크린 검증** | "가능한 만큼" — headless 한계 인정 | chromium headless 의 fullscreen 은 *부분 동작* (`document.fullscreenElement` 가 null 일 수 있음). walkthrough 에 결과와 사유 기록. |

## 📂 Proposed Changes

### Task 1 — 브랜치 + scene 파일 이동 / 추가

#### [MOVE] `studio/public/scenes/hello.md` → `studio/src/scenes/01-hello.md`
- `git mv` 사용 — 추적 보존.

#### [NEW] `studio/src/scenes/02-{슬러그}.md`, `studio/src/scenes/03-{슬러그}.md`
- frontmatter `title` + 본문 (간단 텍스트 + 일부 inline HTML).
- 슬러그 후보:
  - `02-layered-model.md` — "layered presentation 모델 소개" scene
  - `03-event-log.md` — "Scene Event Log 핵심 무기" scene
- 비전 문서 (`docs/planning.md`) 의 핵심 컨셉을 시연 자료로도 활용.

### Task 2 — `loader.ts` (정렬 / 평탄화) + 단위 테스트

#### [NEW] `studio/src/scenes/loader.ts`

```typescript
import { parseScene, type SceneIR } from '../ir/parser';

export interface LoadedScenes {
  sections: string[];     // 모든 scene 의 평탄화된 <section> markup
  scenes: SceneIR[];      // 원본 IR 배열 (scene 별 메타 보존)
  keys: string[];         // 정렬된 scene 파일 키 (e.g., './scenes/01-hello.md')
}

export function loadAllScenes(modules: Record<string, string>): LoadedScenes {
  const keys = Object.keys(modules).sort();
  const scenes = keys.map((k) => parseScene(modules[k]));
  const sections = scenes.flatMap((s) => s.sections);
  return { sections, scenes, keys };
}
```

#### [NEW] `studio/test/scenes.loader.test.ts`

케이스:
1. **정렬**: 키 입력 순서가 `03-c.md`, `01-a.md`, `02-b.md` 일 때, 출력 `keys` 가 `01-a.md`, `02-b.md`, `03-c.md` 순.
2. **평탄화**: scene 3개 각각이 `sections.length === 1` 이면 `loadAllScenes` 의 `sections.length === 3`.
3. (선택) **빈 입력**: `{}` → `sections: []`, `scenes: []`, `keys: []`.

### Task 3 — `viewer.ts` 갱신 (다중 scene 주입)

#### [MODIFY] `studio/src/viewer.ts`

```typescript
import Reveal from 'reveal.js';
import 'reveal.js/dist/reveal.css';
import 'reveal.js/dist/theme/black.css';
import { loadAllScenes } from './scenes/loader';

const sceneModules = import.meta.glob('./scenes/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

async function bootstrap(): Promise<void> {
  const slidesEl = document.getElementById('slides');
  if (!slidesEl) {
    throw new Error('#slides 컨테이너를 찾지 못했습니다.');
  }

  const { sections, scenes } = loadAllScenes(sceneModules);

  // 첫 scene 의 title 을 document.title 로 사용
  const firstTitle = scenes[0]?.meta.title;
  if (firstTitle) document.title = firstTitle;

  slidesEl.innerHTML = sections.join('\n');

  const deck = new Reveal({
    hash: true,        // URL hash 동기화
    controls: true,
    progress: true,
    loop: false,       // 마지막 scene 에서 → 정지 (default)
  });
  await deck.initialize();
}

bootstrap().catch((err: unknown) => {
  console.error('[scene-flow] bootstrap 실패:', err);
});
```

- 기존 `fetch('/scenes/hello.md')` 코드 제거.
- 의존성 import 만 변경, Reveal 호출은 동일 (격리 유지).

### Task 4 — Playwright 자동 검증 + 스크린샷

#### [NEW (임시)] `studio/.verify-multi-nav.mjs`

체크 항목:
1. 시작 화면 — `document.title` = 첫 scene title (`Hello scene-flow` 등)
2. 첫 scene h1 텍스트 확인
3. 키보드 → 키 1회 → URL hash `#/1` 또는 Reveal 의 인덱스 변경 확인
4. 키보드 → 키 1회 더 → 마지막 scene 도달 (전체 3장이면 hash `#/2`)
5. → 한 번 더 → hash 변하지 않음 (정지 확인)
6. F 키 → `document.fullscreenElement` 또는 Reveal 의 fullscreen 상태 (가능한 만큼 — 안 되면 노트)
7. 콘솔 에러 0
8. 스크린샷 2장: scene 1 / scene 2 (마지막 scene 도 가능하면 추가)

검증 후 `.verify-multi-nav.mjs` 삭제 (이전 spec 과 동일 패턴 — `pnpm add -D playwright` 후 `pnpm remove playwright` 로 정리).

#### [NEW] `specs/spec-01-03-multi-scene-navigation/screenshot-scene-1.png`, `screenshot-scene-2.png`
- 다중 scene 동작의 시각 증거.

### Task 5 — README / docs/planning 보강 (선택)

#### [MODIFY] `README.md` (선택)
- 프로젝트 구조 트리에 `studio/src/scenes/` 명시.

#### [MODIFY] `docs/planning.md` (선택)
- §2 Phase 1 산출물에 "scene 디렉토리 자동 발견 + 정렬 컨벤션" 명시.

## 🧪 검증 계획 (Verification Plan)

### 단위 테스트

```bash
cd studio && pnpm run test
```

기대:
- 기존 `test/ir.parser.test.ts` 3 케이스 PASS (회귀)
- 신규 `test/scenes.loader.test.ts` 2~3 케이스 PASS

### 통합 테스트

해당 없음 (Integration Test Required = no).

### 수동 검증 시나리오

1. **scene 자동 수집**: scene 파일 추가 시 dev 서버 HMR 로 자동 반영 확인.
2. **정렬 확인**: 파일명 prefix 가 알파벳 순서대로 viewer 에 표시.
3. **dev 서버 동작**: `pnpm run dev` → http://localhost:5173 (또는 fallback) → 첫 scene 표시.
4. **Playwright**: 위 8 체크 PASS.
5. **풀스크린**: 가능한 만큼 검증, 한계 시 walkthrough 노트.
6. **build / test**: `pnpm run build` 에러 0, `pnpm run test` 모두 PASS.

## 🔁 Rollback Plan

- `git revert <merge commit>` 으로 즉시 원복 — scene 파일이 다시 `public/scenes/` 로 돌아감 (rename 추적이라 가능).
- 새 의존성 없음. 영향 격리됨.

## 📦 Deliverables 체크

- [ ] task.md 작성 (다음 단계)
- [ ] 사용자 Plan Accept
- [ ] (실행 후) scene ≥3장, loader.ts, viewer.ts 갱신
- [ ] (실행 후) 단위 테스트 + Playwright 검증 PASS
- [ ] (실행 후) walkthrough.md / pr_description.md ship + push + PR
