# Implementation Plan: spec-x-hold-for-replanning

## 📋 Branch Strategy

- 신규 브랜치: `spec-x-hold-for-replanning`
- 시작 지점: `main` (phase-01 완료 + 워킹트리 메타 2개 + spec-x 디렉토리)
- 첫 task 가 브랜치 + 메타 + scaffolds 한 commit

## 🛑 사용자 검토 필요 (User Review Required)

> [!IMPORTANT]
> - [ ] **3중 HOLD 표지**: queue.md / README.md / CLAUDE.md — 어느 진입점에서도 즉시 인지
> - [ ] **HOLD 사유 + 다음 작업** 문구가 어디서나 동일 — agent 가 항상 사용자에게 안내
> - [ ] **docs/planning.md §재검토 — 답이 아닌 질문만** 기록 (공부 후 결정)
> - [ ] **코드 변경 0** — `studio/` 미터치
> - [ ] **CLAUDE.md 직접 수정 vs 별 import 파일** — 결정 (아래 참조)

## 🎯 핵심 전략 (Core Strategy)

### 표지 위치 결정

| 위치 | 누가 봄 | 표지 내용 |
|---|---|---|
| `backlog/queue.md` 상단 | agent (`sdd status` / `/hk-align`) | 큰 헤더 + 사유 + 다음 작업 + 재개 조건 |
| `backlog/queue.md` 대기 Phase | agent + 사람 | "재검토" 최우선 항목 + phase-2~4 는 *재검토 이후* |
| `README.md` 상단 | 사람 (GitHub 첫 진입) | 1줄 배지 + 링크 |
| `CLAUDE.md` (또는 별 fragment) | claude 자동 컨텍스트 | "HOLD 상태 + 사용자에게 사유/다음 안내" |

### CLAUDE.md 처리 결정

| 옵션 | 내용 | 추천 |
|---|---|---|
| **(a) CLAUDE.md 에 직접 한 줄 추가** | 기존 `@.harness-kit/CLAUDE.fragment.md` import 위에 1줄 | ★★★ 단순, fragment 와 분리되어 *프로젝트 고유* 의미 |
| (b) `backlog/REPLANNING.md` 만들고 CLAUDE.md 에서 import | 표지 파일 분리 | 약간 무거움, 재개 시 정리 비용 |

→ **(a)** 채택. 재개 시 1줄만 삭제하면 끝.

### 주요 결정

| 컴포넌트 | 결정 | 이유 |
|:---:|:---|:---|
| **3중 표지** | queue.md / README.md / CLAUDE.md | agent / 사람 / claude 모든 진입점 커버 |
| **§재검토 내용** | 질문만 (답 없음) | 답은 공부 후 결정 — 본 spec 은 *HOLD 표지* 만 |
| **재개 조건** | 시나리오 ≥1개 자세히 그리기 + 사용자 명시 승인 | 단순한 진입 장벽 |
| **회귀 테스트** | `pnpm run test` 11/11 | 코드 변경 0 보장 |

## 📂 Proposed Changes

### Task 1 — 브랜치 + 메타 + scaffolds

#### [MODIFY] `backlog/phase-01.md` (이미 워킹트리에 변경)
- Phase Done 체크 + 검증 결과

#### [MODIFY] `backlog/queue.md` (이미 워킹트리에 변경)
- sdd 자동 갱신 결과 (active → 비움, done → phase-1 추가, specx 의 임시 항목 정리)

#### [NEW] `specs/spec-x-hold-for-replanning/{spec, plan, task}.md`

### Task 2 — queue.md HOLD 표지

#### [MODIFY] `backlog/queue.md`
- 제목 바로 아래 (들여쓰기 인용블록 다음) "🚧 프로젝트 HOLD" 섹션 추가
- 대기 Phase 섹션 — "재검토" 최우선 + phase-2~4 *재검토 이후* 명시

### Task 3 — README.md HOLD 배지

#### [MODIFY] `README.md`
- 제목 바로 아래 1줄 배지:
  ```markdown
  > 🚧 **현재 HOLD** — phase-01 완료 후 기획 보강 단계. 사유 / 다음 작업: [`backlog/queue.md`](backlog/queue.md) + [`docs/planning.md`](docs/planning.md) §재검토.
  ```

### Task 4 — CLAUDE.md 안내

#### [MODIFY] `CLAUDE.md`
- 기존 `@.harness-kit/CLAUDE.fragment.md` import 위에:
  ```markdown
  > **🚧 프로젝트 HOLD (2026-05-10)**: phase-01 완료 후 기획 보강 단계입니다.
  > 새 phase / spec 진행 전, 사용자에게 *HOLD 사유 + 다음 작업 (사용자 시나리오 / 편집 UX / AI 위치 등 기획 보강)* 을 먼저 안내하세요.
  > 자세한 내용: `backlog/queue.md` 상단 + `docs/planning.md` §재검토.
  ```

### Task 5 — docs/planning.md §재검토

#### [MODIFY] `docs/planning.md`
- 끝에 `## 7. 재검토 (HOLD, 2026-05-10)` 섹션 추가
- 진단 / 보강 방향 / 외부 사례 후보 (Gamma / Tome / Synthesia / Remotion / Loom)

### Task 6 — Ship

walkthrough / pr_description / ship → push → PR.

## 🧪 검증 계획

### 회귀 테스트

```bash
cd studio && pnpm run test
```

기대: 11/11 (parser 5 + loader 6) — 코드 변경 0.

### 수동 검증

1. **HOLD 표지 일관성**: queue.md / README.md / CLAUDE.md 3 군데의 HOLD 문구가 서로 모순 없음.
2. **agent 안내 시뮬레이션**: `cat CLAUDE.md` → HOLD 안내 보임. `cat backlog/queue.md | head -30` → HOLD 섹션 + "재검토 최우선" 보임.
3. **재개 경로 명확**: §재검토 의 보강 방향 4개 + 외부 사례 후보 5개가 다음 작업의 *진입점* 으로 충분히 구체.

## 🔁 Rollback Plan

- 본 spec 은 *문서 표지* — `git revert <merge commit>` 으로 즉시 원복.
- 재개 시점에 별 spec-x (예: `spec-x-resume-after-replanning`) 가 본 HOLD 표지를 제거.

## 📦 Deliverables 체크

- [ ] task.md 작성 (다음 단계)
- [ ] 사용자 Plan Accept
- [ ] (실행 후) 3중 표지 + §재검토 + 메타 commit + walkthrough/pr ship + PR
