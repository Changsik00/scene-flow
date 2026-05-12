# Walkthrough: spec-x-hold-for-replanning

> 본 문서는 *작업 기록* 입니다. 결정 과정, 사용자 협의, 검증 결과를 남깁니다.

## 📌 결정 기록

| 이슈 | 선택지 | 결정 | 이유 |
|---|---|---|---|
| HOLD 표지 위치 | (1) queue.md 만 / (2) queue + README / (3) 3중 (queue + README + CLAUDE.md) | **(3) 3중** | agent (`sdd status`), GitHub 첫 진입자, claude 자동 컨텍스트 — 세 진입점 모두 즉시 HOLD 인지 |
| CLAUDE.md 처리 | (a) 직접 1줄 추가 / (b) 별 fragment 파일 import | **(a) 직접** | 재개 시 1줄만 삭제. fragment 분리는 무거움 |
| §재검토 내용 깊이 | (1) 답까지 작성 / (2) 질문만 기록 | **(2) 질문만** | 답은 공부 후 결정. 본 spec 은 *HOLD 표지* 만이 책임 |
| 재개 조건 | (1) 4개 보강 방향 모두 / (2) 시나리오 1개 자세히 + 사용자 승인 | **(2)** | 단순한 진입 장벽. 시나리오가 빈 공간의 *핵심* |

## 💬 사용자 협의

- **주제**: phase-01 결과에 대한 회의감
  - **사용자 의견**: "ppt 부분이 html 로 만들어 지는데 그걸 어떻게 제어 하는가가 빠진 느낌. html 편집인지 chat 으로 AI generation 인지 미정. 진행보다 계획 보강이 맞다."
  - **합의**: 추가 phase 진행 *중지* → 프로젝트 HOLD → 기획 보강 우선.

- **주제**: HOLD 안내 의무
  - **사용자 의견**: "agent 에게 다음 진행을 묻게 되면 HOLD 된 이유와 다음 작업을 안내 해줘. 시나리오가 부족해서 기획을 더 완성해야 한다고 알려줘."
  - **합의**: 3중 표지 (queue / README / CLAUDE.md) 로 *어디로 진입해도* 안내가 자동으로 작동.

## 🧪 검증 결과

### 1. 자동화 테스트

#### 단위 테스트
- **명령**: `cd studio && pnpm run test`
- **결과**: ✅ Passed (11 tests in 0.27 s)
- **로그 요약**:
```text
 ✓ test/scenes.loader.test.ts (6 tests)
 ✓ test/ir.parser.test.ts (5 tests)
 Test Files  2 passed (2)
      Tests  11 passed (11)
```

코드 변경 0 → 회귀 가능성 없음을 확인.

### 2. 수동 검증

1. **Action**: `cat backlog/queue.md | head -25`
   - **Result**: 🚧 HOLD 섹션이 제목 직후 노출. 사유 / 다음 작업 / 재개 조건 + agent 안내가 한 화면에.

2. **Action**: `cat README.md | head -6`
   - **Result**: HOLD 배지가 제목 바로 아래 1줄, `backlog/queue.md` 와 `docs/planning.md §7` 링크 포함.

3. **Action**: `cat CLAUDE.md`
   - **Result**: `PROJECT-HOLD:BEGIN ~ END` 블록이 harness-kit fragment 위에 위치 → claude 가 매 세션마다 자동 로드.

4. **Action**: `cat docs/planning.md | tail -120`
   - **Result**: §7 재검토 섹션 — 진단 (4 빈 공간) / 보강 방향 4개 / 외부 사례 5개 / 재개 조건 / 진행 중지 작업 목록.

## 🔍 발견 사항

- phase-01 은 *부품* 을 만들었지만 *사용자 시나리오 한 줄* 도 명문화되지 않았다. SDD 가 형식만 따랐을 뿐 vision 단계가 약했던 패턴 — 다음 phase 진입 전에 항상 "누가, 어떻게, 무엇을 만들기 위해 사용하는가" 를 명시할 것.
- phase base branch 모드를 phase-01 에서 OFF 로 시작한 결과 phase-ship PR 이 불가능했다. phase-02 부터는 base branch 모드 ON 권장 (이미 queue.md 대기 Phase 메모).
- AI agent 의 위치를 phase-4 (선택) 로 미뤘으나, 편집 UX 결정에 따라 *처음* 부터 핵심일 수 있다 — §7.2 C 항목에 명시.

## 🚧 이월 항목

- 기획 보강 — 사용자 시나리오 1~3개 자세히 그리기 → `backlog/queue.md` 대기 Phase 최우선 항목으로 등록 (재개 spec 시점에 별 spec-x 또는 phase-02 vision 단계로 처리).

## 📅 메타

| 항목 | 값 |
|---|---|
| **작성자** | Agent (Opus 4.7) + dennis |
| **작성 기간** | 2026-05-10 ~ 2026-05-11 |
| **최종 commit** | (ship 시점에 갱신) |
