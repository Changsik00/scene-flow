# spec-x-hold-for-replanning: 프로젝트 HOLD — 기획 보강 우선

## 📋 메타

| 항목 | 값 |
|---|---|
| **Spec ID** | `spec-x-hold-for-replanning` |
| **Phase** | N/A (Solo Spec) |
| **Branch** | `spec-x-hold-for-replanning` |
| **상태** | Planning |
| **타입** | Docs (+ Chore) |
| **Integration Test Required** | no |
| **작성일** | 2026-05-10 |
| **소유자** | dennis |

## 📋 배경 및 문제 정의

### 현재 상황

- Phase-01 (Scene Engine) 의 5개 spec 모두 Merged. viewer / IR / 다중 scene / transition / fragment / PDF 출력까지 *부품* 동작.
- 직전 turn 에서 사용자가 회의감을 표명: "phase-1 결과가 뭐지? 기대치에 어긋날 것 같다."
- 분석 결과 비전 문서 (`docs/planning.md`) 의 **빈 공간** 이 다수 식별됨:
  - 편집 UX 부재 (MD 직접 / chat / GUI / AI 자동 중 어느 것?)
  - AI agent 의 위치 / 트리거 모호
  - 사용자 시나리오 (User Journey) 부재
  - 녹화 ↔ 합성 사이의 조작 단계 (자막 검토, 부분 재녹화, 미리보기 등) 미정의

### 문제점

1. **부품만 만들고 조립 방법을 모름**: phase 2/3/4 를 무작정 진행하면 *부품만 더* 만드는 결과. 사용자가 실제 워크플로우를 시뮬레이션해보면 도구가 *작동* 해도 *쓸 만하지* 않을 위험.
2. **HOLD 상태가 git 에 안 박힘**: 워킹트리에만 두면 새 세션 / 다른 환경에서 안 보임. 미래의 agent 가 `/hk-align` 했을 때 *진행 가능 상태로 잘못 판단* 할 위험.
3. **공부 / 재검토 모드를 *공식화* 해야 함**: phase-2 의 alignment 가 아닌, *비전 redesign* 단계.

### 해결 방안 (요약)

본 spec-x 한 PR 에서:

1. **3중 HOLD 표지** — agent / 사람 / claude 자동 컨텍스트 어느 진입점에서도 즉시 인지:
   - `backlog/queue.md` 상단에 큰 HOLD 섹션
   - `README.md` 상단에 HOLD 배지
   - `CLAUDE.md` 에 한 줄 안내 (claude 자동 로드)
2. **`docs/planning.md` 에 "재검토" 섹션 추가** — 회의감의 정확한 진단 + 보강 방향 + *질문만 명확히* (답은 공부 후 결정).
3. **`backlog/queue.md` 대기 Phase 섹션** — 최우선으로 "🚧 프로젝트 재검토 / 기획 보강" 항목 추가. phase-2/3/4 후보는 *재검토 이후* 로 명시.
4. **워킹트리에 떠 있던 phase-01 메타** (`phase-01.md` Phase Done 체크 + queue.md 의 done 이동) 도 함께 commit.

## 🎯 요구사항

### Functional Requirements

1. **`backlog/queue.md` HOLD 표지** — sdd 자동 갱신 영역 *밖* (사람 편집 영역) 에 추가:
   ```markdown
   ## 🚧 프로젝트 HOLD — 기획 보강 우선

   **현재 상태**: phase-01 완료 후 **재검토 단계**. 새 phase 진행 *중지*.

   **사유**: 사용자 시나리오 / 편집 UX / AI agent 위치 등 핵심 빈 공간이 발견됨.
   부품은 만들었지만 *누가 어떻게 조립해서 사용하는지* 가 미정의.

   **다음 작업**: `docs/planning.md` 의 "재검토" 섹션 참조 — 사용자 시나리오 그리기 / 편집 UX 결정 / AI 위치 명시 / phase 재정의 검토.

   **재개 조건**: 위 4 항목 중 최소 *사용자 시나리오 1개* 가 자세히 그려진 후, 사용자 명시 승인.
   ```
2. **`backlog/queue.md` 대기 Phase 섹션 갱신** — 기존 "phase-01" 항목 (완료) 자리에 **"🚧 프로젝트 재검토 / 기획 보강 (최우선)"** 로 갱신:
   ```markdown
   ## 📋 대기 Phase

   - **🚧 [최우선] 프로젝트 재검토 / 기획 보강** — HOLD 사유 해소까지 다른 작업 중지
     - 시나리오 1~3개 그리기
     - 편집 UX 결정 (MD / chat / GUI / AI)
     - AI agent 위치 / 트리거 결정
     - phase 재정의 검토 (기능 분할 → 행동 분할?)
     - 참조: `docs/planning.md` §재검토

   - **phase-02 (Recording Layer)** — *재검토 이후*. base branch 모드 ON 으로 시작 권장.
   - **phase-03 (Composition)** — 재검토 이후.
   - **phase-04 (AI Automation)** — 재검토 이후 (위치가 *처음* 으로 옮겨질 가능성 있음).
   ```
3. **`README.md` 상단 HOLD 배지** — 제목 바로 아래 짧게:
   ```markdown
   > 🚧 **현재 HOLD** — phase-01 완료 후 기획 보강 단계. 자세한 사유 / 다음 작업: [`backlog/queue.md`](backlog/queue.md) 와 [`docs/planning.md`](docs/planning.md) §재검토.
   ```
4. **`CLAUDE.md` 한 줄 추가** — claude 자동 로드 컨텍스트:
   ```markdown
   > **프로젝트 HOLD 상태**: phase-01 완료 후 기획 보강 단계. 새 phase / spec 진행 전 사용자에게 *HOLD 사유 + 다음 작업 (시나리오 / UX / AI 위치 등 기획 보강)* 을 안내해야 함. 자세한 내용: `backlog/queue.md` 상단 + `docs/planning.md` §재검토.
   ```
   (단 CLAUDE.md 는 현재 fragment import 만 있음 — 안 건드리고 별 `backlog/REPLANNING.md` 파일을 만들고 CLAUDE.md 에서 import 하는 것도 검토. plan.md 에서 결정.)
5. **`docs/planning.md` "재검토" 섹션** — 회의감의 진단 + 보강 방향 + 질문 (답 없음):
   ```markdown
   ## 7. 재검토 (HOLD, 2026-05-10)

   ### 회의감의 진단
   - phase-01 까지 *부품* 은 만들었으나 *사용자가 어떻게 조립해 쓰는지* 모름
   - 빈 공간 4개: 편집 UX / AI 위치 / 사용자 시나리오 / 녹화-합성 사이 조작

   ### 보강 방향 (답은 공부 후)
   - 사용자 시나리오 1~3개 자세히 그리기 (예: 유튜브 5분 강의, 사내 발표 15분)
   - 편집 UX 결정 — (a) MD 직접 / (b) chat → AI 생성 / (c) studio GUI / (d) 하이브리드
   - AI agent 위치 — phase-4 (선택) 가 아니라 *처음* 부터 핵심일 가능성
   - phase 재정의 — *기능* 분할 → *행동* 분할 로 재구성 검토

   ### 외부 사례 검토 후보
   - Gamma / Tome — AI slide
   - Synthesia / HeyGen — AI 영상
   - Remotion / Motion Canvas — code-first 영상
   - Loom — 화면 + 음성 녹화
   - 위 도구들의 *편집 UX* / *AI 위치* / *워크플로우* 를 벤치마크
   ```
6. **워킹트리 phase-01 메타 commit** — `backlog/phase-01.md` (Phase Done 체크 + 검증 결과 누적) + `backlog/queue.md` (sdd 자동 갱신 결과) 도 함께.

### Non-Functional Requirements

1. **코드 변경 0** — `studio/` 미터치.
2. **새 의존성 0**.
3. **산출 문서 한국어**.
4. **회귀 보호** — `pnpm run test` 11/11 (코드 변경 0 검증).
5. **표지 일관성** — queue.md / README.md / CLAUDE.md 의 HOLD 문구가 서로 모순되지 않게.

## 🚫 Out of Scope

- **HOLD 의 *답* (시나리오 / UX / AI 위치 결정)** — 본 spec 은 *질문 정리만*. 답은 별 spec / 공부 후.
- **phase-2/3/4 의 재정의** — 재검토 후 결정.
- **외부 도구 벤치마크 보고서** — 본 spec 범위 밖. 별 작업.
- **새 viewer 기능 / studio 코드 변경**.

## 🔍 Critique 결과

미실행.

## ✅ Definition of Done

- [ ] `backlog/queue.md` 상단에 🚧 HOLD 섹션 + 대기 Phase 의 "재검토" 최우선 항목
- [ ] `README.md` 상단 HOLD 배지
- [ ] `CLAUDE.md` (또는 별 파일 import) 에 HOLD 안내 한 줄
- [ ] `docs/planning.md` "재검토" 섹션 (진단 + 보강 방향 + 외부 사례)
- [ ] 워킹트리에 떠 있던 phase-01 메타 commit
- [ ] `pnpm run test` 11/11 회귀 PASS
- [ ] walkthrough.md / pr_description.md ship commit
- [ ] PR 생성 + 사용자 검토 요청 알림
- [ ] PR merge 후 `sdd specx done hold-for-replanning`
