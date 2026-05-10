# ADR-003: 저장소 구조 — 거버넌스 + studio/ 컨테이너 + pnpm

| 항목 | 값 |
|---|---|
| **Status** | Accepted |
| **결정일** | 2026-05-10 |
| **결정 SPEC** | `spec-01-02-restructure-after-bootstrap` |
| **결정 단위** | scene-flow 저장소 전체 |
| **참조** | `docs/planning.md` 비전, `docs/decisions/ADR-001-scene-ir.md` (IR), `docs/decisions/ADR-002-render-engine.md` (점진 이주) |

## Context

`spec-01-01-bootstrap-viewer` (PR #2) 머지 후 main 의 최상위 디렉토리에 *세 종류* 의 항목이 한 평면에 섞여 있다:

- **코드**: `package.json`, `tsconfig.json`, `vite.config.ts`, `src/`, `public/`, `test/`, (산출물) `node_modules/`, `dist/`
- **거버넌스**: `specs/`, `backlog/`, `docs/`, (인프라) `.harness-kit/`, `.claude/`
- **진입점**: `README.md`, `CLAUDE.md`, `.gitignore`

이 상태는 GitHub 첫 화면을 어수선하게 만들고, 향후 `runtime/` / `recorder/` 같은 새 모듈이 추가될 때 더 악화된다.

또한 PR review 도중 사용자와 다음 결정이 합의됨:

1. 패키지 매니저: **npm → pnpm**
2. 코드 컨테이너: **`studio/`** 디렉토리로 묶음
3. 미래 React 도입은 **ADR-002 의 점진 이주 정책 연장** — *지금* React/Tailwind/shadcn/FSD/front.md 는 도입 안 함 (오버엔지니어링 회피)

본 ADR 은 이 4 결정을 영구 기록한다.

### 평가 축

| 축 | 의미 |
|---|---|
| **첫 진입자 명료성** | GitHub 첫 화면 / 클론 직후 `ls` 결과가 직관적인가 |
| **확장성** | 향후 `runtime/`, `recorder/`, multi-package 분할 시 자연스러운가 |
| **tooling 마찰** | Vite / TypeScript / pnpm 와의 호환 |
| **이주 비용** | 결정이 잘못되었을 때 다른 구조로 갈아탈 비용 |
| **현 시점 코드 무게** | phase-1 의 hello world 검증 단계에 부담을 주지 않는가 |

### Alternatives 검토

| 옵션 | 첫 진입자 | 확장성 | tooling | 이주 비용 | 현 시점 무게 |
|---|:---:|:---:|:---:|:---:|:---:|
| (a) 현 상태 유지 | ★ | ★ | ★★★ | ★★★ | ★★★ |
| (b) `src/` rename only (예: `src/` → `studio/`) | ★ | ★ | ★★★ | ★★ | ★★★ |
| **(c) 거버넌스 + 진입점 + `studio/` 3 평면 (본 ADR)** | ★★★ | ★★ | ★★★ | ★★ | ★★★ |
| (d) `packages/studio/` monorepo 정식 분할 (workspace 등) | ★★★ | ★★★ | ★★ | ★ | ★ |
| (e) 지금 React + Tailwind + shadcn + FSD + front.md 모두 도입 | ★★ | ★★★ | ★★ | ★ | ★ |

## Decision

### 1. 저장소 구조

```
scene-flow/
├── README.md                    ← 진입점
├── CLAUDE.md
├── .gitignore
├── .claude/                     ← 인프라 (commit 영역 + ignored state)
├── .harness-kit/                ← 인프라 (gitignored)
│
├── specs/                       ← 거버넌스: SDD 작업 로그
├── backlog/                     ← 거버넌스: phase / queue
├── docs/                        ← 거버넌스: ADR, planning
│
└── studio/                      ← 코드 (npm 패키지)
    ├── package.json
    ├── pnpm-lock.yaml
    ├── tsconfig.json
    ├── vite.config.ts
    ├── src/                     ← viewer / IR / (미래 React 컴포넌트)
    ├── public/
    │   └── scenes/
    ├── test/
    └── node_modules/  (gitignored)
        dist/          (gitignored)
```

**3 평면**:
- *진입점* — README / CLAUDE / .gitignore
- *거버넌스* — specs/ backlog/ docs/
- *코드* — studio/

### 2. 패키지 매니저: **pnpm**

- corepack 으로 활성 (Node 20+ 동봉) — 시스템 설치 부담 최소
- `package.json` 의 `"packageManager"` 필드로 버전 고정
- npm `package-lock.json` 폐기 → `pnpm-lock.yaml`

### 3. dev 명령 위치: `cd studio && pnpm run dev`

- root 에 thin wrapper package.json 두지 않음 — 단일 패키지 단계엔 불필요
- 진짜 multi-package 가 필요해지면 그때 도입 (별 ADR 또는 본 ADR 갱신)

### 4. 미래 도입 자리만 명시 (지금 도입 안 함)

| 도입 후보 | 적정 시점 (예상) | 도입 시 위치 |
|---|---|---|
| **React** | phase-2 / phase-3 — Event Log 시각화 또는 합성 GUI 가 필요해질 때 | `studio/src/` 안에 React 컴포넌트 점진 도입. 또는 `studio/` 분리 (`studio-react/`) — 그때 결정. |
| **Tailwind CSS** | React 도입과 함께 | `studio/` 안 |
| **shadcn/ui** | React + Tailwind 안정화 후, 디자인 시스템 필요해질 때 | `studio/src/components/ui/` |
| **FSD (Feature-Sliced Design)** | studio 가 multi-feature GUI 가질 때 (시나리오 편집 / 자막 / Event Log 시각화 / 합성 미리보기 등) | `studio/src/{entities,features,widgets,pages,shared}` 또는 더 가벼운 layered 패턴 |
| **front.md (프론트 가이드)** | 첫 React 컴포넌트 commit 시점 | `docs/front.md` |
| **monorepo 정식 분할** (`packages/studio`, `packages/runtime`, `packages/recorder`) | phase-2 의 Recording 또는 phase-3 의 Composition 이 *별 패키지* 로 떨어지는 게 명확해질 때 | 별 ADR 신설 + workspace 도입 |

**원칙**: 비전은 ADR 로 못 박되, 스택 자체는 *그게 필요한 시점에* 도입. 이렇게 해야 phase-1 의 *최소 동작 검증* 이 무겁지 않고, 도입 시점의 *최신 best practice* 로 시작 가능.

### 5. ADR-002 점진 이주와의 관계

ADR-002 는 viewer 의 *렌더 엔진* (Reveal.js → 플러그인 → 자체) 점진 이주를 정의. 본 ADR-003 은 그 이주가 *어디서 일어나는가* 를 정한다:

- 모든 단계는 `studio/src/` 안에서 일어남
- `studio/` 의 *외관* (컨테이너 이름) 은 vanilla TS 단계든 React 단계든 동일
- 외부 (specs/, docs/, README) 가 코드 구조 이주에 영향받지 않음 → 이주 비용이 `studio/src/` 1 곳에 한정

## Consequences

### Positive

- **GitHub 첫 화면 깔끔**: 진입자가 README + studio/ + 거버넌스 디렉토리 만 봐도 프로젝트 의도 파악
- **확장 자연**: 향후 `runtime/`, `recorder/` 같은 모듈은 동일 평면 (root) 에 같이 추가 — 인지 비용 적음
- **이주 비용 격리**: ADR-002 의 점진 이주는 `studio/src/` 안에서만 일어남
- **pnpm 의 강점 활용**: disk efficient, monorepo 친화 (미래 multi-package 대비)
- **현재 코드 무게 보존**: phase-1 의 동작이 *완전히 동일* — 단순 디렉토리 이동 + 도구 변경

### Negative

- **dev 명령에 `cd studio` 추가**: root 에서 한 번에 안 됨. 단점 작음 — README 에 1줄로 명시.
- **Vite root / TS include 경로 갱신** 필요. 단발성 작업, 미래엔 영향 없음.
- **사용자 환경에 pnpm 필요**: corepack 활성 (Node 20+) 또는 `npm i -g pnpm`. 1회성 비용.
- **표준에서 살짝 벗어남**: 일반 Node 프로젝트는 `package.json` 이 root 에. 본 구조는 *meta-repo + sub-package* 패턴에 가까움. 단점 작음 — `studio/` 안은 표준 그대로.

### 거부된 이유 (요약)

- **(a) 현 상태 유지**: 첫 진입자 어수선. 확장 시 더 악화.
- **(b) `src/` rename only (예: studio)**: 의미적 충돌 — 지금 코드는 *runtime* 본질이라 studio 라 부르면 미래 React studio 와 이름 충돌. 또 *최상위 평면 섞임* 문제는 해결 안 됨.
- **(d) `packages/studio/` monorepo 정식 분할**: 단일 패키지 단계에 workspace / hoisting / lockfile 정책 등 형식이 과함. 진짜 multi-package 가 필요해지면 그때 도입.
- **(e) 지금 React + Tailwind + shadcn + FSD + front.md 도입**: 오버엔지니어링. 코드 0줄에서 hello world 1장 보여주는 데 도입할 스택이 아님. phase-1 의 디버깅 표면적이 부담스럽게 커짐. *비전은 ADR 자리만*, *스택은 적정 시점에*.

## 변경 / 폐기 절차

본 ADR 은 다음 트리거 발생 시 갱신 (별 ADR 신설 가능):

| 트리거 | 다음 단계 |
|---|---|
| `runtime/` 또는 `recorder/` 같은 *별 패키지* 가 필요해짐 | monorepo 정식 분할 (`packages/`) — 새 ADR |
| React 도입 시점 도래 (phase-2 / phase-3) | 본 ADR 갱신 또는 ADR-004-frontend-stack 신설 (Tailwind / shadcn / FSD 결정 함께) |
| `studio` 라는 이름이 더 큰 의미로 다른 디렉토리 (예: studio app vs studio editor) 로 분리 필요 | 본 ADR 갱신 |

각 단계는 *별 spec / phase* 로 진행. 본 ADR 은 그 길을 막지 않는다.
