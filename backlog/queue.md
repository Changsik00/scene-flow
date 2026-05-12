# Backlog Queue

> 본 문서는 *대시보드* 입니다. "지금 무엇을 하고 있고, 다음에 무엇을 해야 하는가"를 한눈에 보기 위함.
>
> **자동 갱신 마커**: `active`, `specx`, `done` — 마커 (`<!-- sdd:... -->`) 사이는 sdd 가 관리하므로 그대로 두세요.
> **사람 편집 섹션**: `🧊 Icebox`, `📋 대기 Phase` — 자유 메모.

---

## 🚧 프로젝트 HOLD — 기획 보강 우선 (2026-05-10)

**현재 상태**: phase-01 (Scene Engine) 완료 후 **재검토 단계**. 새 phase 진행 *중지*.

**사유**: phase-01 까지 *부품* (viewer / IR / 다중 scene / transition / fragment / PDF) 은 만들었으나, 사용자 시나리오 / 편집 UX / AI agent 위치 / 녹화-합성 사이 조작 단계 등 *핵심 빈 공간* 이 다수. 누가 어떻게 조립해 사용하는지 미정의 — 추가 phase 진행 시 부품만 늘어날 위험.

**다음 작업**: `docs/planning.md` §7. 재검토 참조 — 사용자 시나리오 그리기 / 편집 UX 결정 / AI 위치 명시 / phase 재정의 검토 / 외부 사례 (Gamma / Tome / Synthesia / Remotion / Loom) 벤치마크.

**재개 조건**: 위 보강 방향 4개 중 *최소 사용자 시나리오 1개* 가 자세히 그려진 후, 사용자 명시 승인.

> 🤖 **agent 안내**: 새 세션 / `/hk-align` / "다음 작업 뭐 할까" 같은 요청을 받으면, *추가 phase 진행을 제안하기 전에* 위 사유와 다음 작업을 사용자에게 먼저 안내하세요. 사용자가 시나리오를 구체화하면 그것을 기반으로 alignment.

---

## 📦 진행 중 Phase

<!-- sdd:active:start -->
(active phase 없음. `bin/sdd phase new <slug>` 로 시작)
<!-- sdd:active:end -->

## 📥 spec-x 대기

<!-- sdd:specx:start -->
없음
- [ ] spec-x-hold-for-replanning — hold-for-replanning
<!-- sdd:specx:end -->

## 🧊 Icebox

> 아이디어·보류 항목 보관소. 실행 불가. 관련 항목이 쌓이면 Phase로, 단발이면 spec-x로 승격.
> 이 섹션은 sdd가 건드리지 않습니다. 자유롭게 편집하세요.

<!-- 예시:
- [ ] 아이디어: sdd stale detection 자동화
- [ ] 보류: spec-05-02 (dependency 해소 후 재검토)
-->

## 📋 대기 Phase

> 다음에 진행할 phase 를 자유롭게 메모합니다 (사람이 직접 편집).
> 자동 갱신되지 않습니다 — Icebox 와 동일한 정책.

- **🚧 [최우선] 프로젝트 재검토 / 기획 보강** — HOLD 사유 해소까지 다른 작업 *중지*
  - 사용자 시나리오 1~3개 자세히 그리기 (예: 유튜브 5분 강의, 사내 발표 15분)
  - 편집 UX 결정 — (a) MD 직접 / (b) chat → AI 생성 / (c) studio GUI / (d) 하이브리드
  - AI agent 위치 / 트리거 결정 — phase-4 (선택) 가 아니라 *처음* 부터 핵심일 가능성
  - phase 재정의 검토 — *기능* 분할 → *행동* 분할
  - 외부 사례 벤치마크 — Gamma / Tome / Synthesia / Remotion / Loom
  - 참조: `docs/planning.md` §7. 재검토

- **phase-02 (Recording Layer)** — *재검토 이후*. base branch 모드 ON 으로 시작 권장 (이번엔 정식 phase-ship 가능).
- **phase-03 (Composition)** — *재검토 이후*.
- **phase-04 (AI Automation)** — *재검토 이후* (위치가 *처음* 으로 옮겨질 가능성 있음).

## ✅ 완료

<!-- sdd:done:start -->
없음
- [x] spec-x-rebrand-vision (완료)
- **1** — ? — completed 2026-05-11
<!-- sdd:done:end -->

---

## 📖 사용 방법

| 명령 | 동작 |
|---|---|
| `sdd phase new <slug>` | 새 Phase 생성 → 진행 중으로 등록 |
| `sdd phase new <slug> --base` | Phase base branch 모드로 생성 (opt-in) |
| `sdd spec new <slug>` | 진행 중 Phase에 다음 spec 등록 |
| `sdd plan accept` | spec Plan Accept → 실행 모드 진입 |
| `sdd ship` | spec 완료 처리 → Merged 갱신 + state 초기화 + NEXT 안내 |
| `sdd phase done <N>` | Phase 완료 → 완료 섹션으로 이동 |

자세한 사용법: `agent/constitution.md` §3 Work Type Model, `agent/agent.md`
