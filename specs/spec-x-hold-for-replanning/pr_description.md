# docs(spec-x-hold-for-replanning): mark project HOLD and add replanning section

> 본 PR 은 코드 변경 0 — *문서 표지* 와 *재검토 질문 정리* 만 담당합니다.

## 📋 Summary

### 배경 및 목적

phase-01 (Scene Engine) 완료 후 결과를 점검한 결과, *부품* (viewer / IR / 다중 scene / transition / fragment / PDF) 은 만들었으나 누가 어떻게 조립해 사용하는지 (사용자 시나리오 / 편집 UX / AI agent 위치 / 녹화-합성 사이 조작 단계) *핵심 빈 공간* 이 다수 발견되었습니다. 추가 phase 진행 시 부품만 늘어날 위험이 있어, **프로젝트 HOLD → 기획 보강 우선** 으로 결정.

본 PR 은 그 HOLD 상태를 *어떤 진입점에서도 즉시 인지* 할 수 있도록 3중 표지를 박고, 재검토 시 다룰 질문을 `docs/planning.md §7` 에 정리합니다.

### 주요 변경 사항

- [x] **3중 HOLD 표지** — `backlog/queue.md` 상단 + `README.md` 상단 + `CLAUDE.md` 안내 블록
- [x] **대기 Phase 갱신** — "🚧 [최우선] 재검토" 가 phase-2~4 보다 위로, phase-2~4 는 "재검토 이후" 로 표시
- [x] **`docs/planning.md §7. 재검토`** — 회의감의 진단 (4 빈 공간) / 보강 방향 4개 / 외부 사례 후보 5개 (Gamma / Tome / Synthesia / Remotion / Loom) / 재개 조건
- [x] **코드 변경 0** — `studio/` 디렉토리 미터치, 회귀 테스트 11/11 PASS

### Phase 컨텍스트

- **Phase**: N/A (spec-x 단발 작업)
- **본 SPEC 의 역할**: phase-01 종료 직후 *프로젝트 거버넌스* 를 HOLD 상태로 전환. 다음 phase 진입 전 사용자 시나리오 + 편집 UX 결정을 강제하는 안전장치.

## 🎯 Key Review Points

1. **3중 표지의 일관성**: queue.md / README.md / CLAUDE.md 의 HOLD 문구가 서로 모순되지 않고, 모두 `backlog/queue.md` 와 `docs/planning.md §7` 로 수렴.
2. **agent 안내 의무**: `CLAUDE.md` 의 `PROJECT-HOLD` 블록이 claude 자동 컨텍스트에 매번 로드 — 새 세션 / `/hk-align` / "다음 작업 뭐 할까" 같은 요청 시 *HOLD 사유 + 다음 작업* 을 사용자에게 먼저 안내하도록 명시.
3. **재개 조건의 진입 장벽**: 시나리오 ≥1개 자세히 그리기 + 사용자 명시 승인 — 단순하지만 *빠르게 다시 진행하려는 충동* 을 막는 게이트.
4. **§7 은 답이 아닌 질문**: 보강 방향 4개 (시나리오 / 편집 UX / AI 위치 / phase 재정의) 와 외부 사례 5개는 *공부할 항목 목록*. 답을 미리 박지 않음 — HOLD 본분에 충실.

## 🧪 Verification

### 자동 테스트
```bash
cd studio && pnpm run test
```

**결과 요약**:
- ✅ `test/ir.parser.test.ts` (5 tests): 통과
- ✅ `test/scenes.loader.test.ts` (6 tests): 통과
- **Total**: 11/11 PASS (코드 변경 0 → 회귀 없음 확인)

### 수동 검증 시나리오

1. **agent 진입 시뮬레이션**: `cat CLAUDE.md` → HOLD 안내 첫 화면에 노출.
2. **GitHub 진입자 시뮬레이션**: `cat README.md | head -6` → HOLD 배지 + 링크 즉시 노출.
3. **`sdd status` 시뮬레이션**: `cat backlog/queue.md | head -25` → HOLD 섹션 + 대기 Phase 최우선 항목 노출.
4. **재검토 질문 충실성**: `docs/planning.md §7` 의 보강 방향 4개 + 외부 사례 5개가 다음 작업의 진입점으로 충분히 구체적.

## 📦 Files Changed

### 🆕 New Files
- `specs/spec-x-hold-for-replanning/spec.md`: HOLD 명세
- `specs/spec-x-hold-for-replanning/plan.md`: 3중 표지 전략 + §7 구성
- `specs/spec-x-hold-for-replanning/task.md`: 6 task 분해
- `specs/spec-x-hold-for-replanning/walkthrough.md`: 결정 기록 + 검증

### 🛠 Modified Files
- `backlog/queue.md`: 🚧 HOLD 섹션 신설 + 대기 Phase 갱신
- `backlog/phase-01.md`: phase-01 Done 메타 (사전 갱신분)
- `README.md`: 제목 직후 HOLD 배지
- `CLAUDE.md`: `PROJECT-HOLD` 블록 신설 (재개 시 1줄 제거)
- `docs/planning.md`: `§7. 재검토` 추가

**Total**: 9 files (4 new specs + 5 modified)

## ✅ Definition of Done

- [x] 모든 단위 테스트 통과 (11/11)
- [x] `walkthrough.md` ship commit 완료
- [x] `pr_description.md` ship commit 완료
- [x] 3중 HOLD 표지 일관성 확인
- [x] `docs/planning.md §7` 재검토 섹션 작성
- [x] 사용자 검토 요청 알림 완료

## 🔗 관련 자료

- 재검토 진입점: `backlog/queue.md` 상단 + `docs/planning.md §7`
- Walkthrough: `specs/spec-x-hold-for-replanning/walkthrough.md`
- 직전 phase 결과: `backlog/phase-01.md` (Scene Engine 완료)
