# Task List: spec-x-hold-for-replanning

> 모든 task 는 한 commit 에 대응합니다 (One Task = One Commit).

## Pre-flight

- [x] Spec ID 확정 및 디렉토리 생성 (sdd specx new)
- [x] spec.md 작성
- [x] plan.md 작성
- [x] task.md 작성 (이 파일)
- [-] 백로그 업데이트 — spec-x 는 phase 표 갱신 N/A
- [ ] 사용자 Plan Accept

---

## Task 1: 브랜치 + 워킹트리 메타 + scaffolds

### 1-1. 브랜치
- [ ] `git checkout -b spec-x-hold-for-replanning`

### 1-2. 메타 + scaffolds 한 commit
- [ ] `git add backlog/phase-01.md backlog/queue.md specs/spec-x-hold-for-replanning/{spec,plan,task,walkthrough}.md`
- [ ] Commit: `chore(spec-x-hold-for-replanning): commit phase-01 done meta and add spec scaffolds`

---

## Task 2: queue.md HOLD 표지

### 2-1. queue.md 상단 HOLD 섹션 + 대기 Phase 갱신
- [ ] `backlog/queue.md` 제목 바로 아래에 "🚧 프로젝트 HOLD" 섹션 추가 (사유 + 다음 작업 + 재개 조건)
- [ ] 대기 Phase 섹션 — "재검토" 최우선 + phase-2~4 *재검토 이후*

### 2-2. Commit
- [ ] Commit: `docs(spec-x-hold-for-replanning): add HOLD banner and waiting phase to queue.md`

---

## Task 3: README.md HOLD 배지

### 3-1. README 상단 배지
- [ ] `README.md` 제목 바로 아래 1줄 (queue.md / planning.md §재검토 링크)

### 3-2. Commit
- [ ] Commit: `docs(spec-x-hold-for-replanning): add HOLD banner to README`

---

## Task 4: CLAUDE.md 안내

### 4-1. CLAUDE.md 한 줄 추가
- [ ] 기존 fragment import 위에 "🚧 프로젝트 HOLD" 안내 (사용자에게 사유 + 다음 안내 의무)

### 4-2. Commit
- [ ] Commit: `docs(spec-x-hold-for-replanning): add HOLD notice to CLAUDE.md`

---

## Task 5: docs/planning.md §재검토

### 5-1. §7 재검토 섹션 추가
- [ ] 끝에 추가:
  - 회의감의 진단 (빈 공간 4개)
  - 보강 방향 4개 (시나리오 / UX / AI 위치 / phase 재정의)
  - 외부 사례 후보 5개 (Gamma / Tome / Synthesia / Remotion / Loom)

### 5-2. Commit
- [ ] Commit: `docs(spec-x-hold-for-replanning): add replanning section to planning`

---

## Task 6: 회귀 보호 + Ship

### 6-1. 회귀 테스트
- [x] `cd studio && pnpm run test` → 11/11 PASS
- [x] `./.harness-kit/bin/sdd test passed`

### 6-2. walkthrough + pr_description + ship
- [x] walkthrough.md 작성 (짧게)
- [x] pr_description.md 작성
- [x] `sdd ship` → ship commit 생성
- [ ] task.md finalize commit (필요 시)

### 6-3. Push + PR
- [ ] `git push -u origin spec-x-hold-for-replanning`
- [ ] `gh pr create` (사용자 `[Y/n]`)
- [ ] PR URL 보고

---

## 진행 요약

| 항목 | 값 |
|---|---|
| **총 Task 수** | 6 (Pre-flight 별도) |
| **예상 commit 수** | 5~6 |
| **코드 변경** | 0 |
| **현재 단계** | Planning |
| **마지막 업데이트** | 2026-05-10 |
