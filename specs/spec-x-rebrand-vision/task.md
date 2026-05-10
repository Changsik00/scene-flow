# Task List: spec-x-rebrand-vision

> 모든 task 는 한 commit 에 대응합니다 (One Task = One Commit).
> 매 commit 직후 본 파일의 체크박스를 갱신해야 합니다.

## Pre-flight (Plan 작성 단계)

- [x] Spec ID 확정 및 디렉토리 생성
- [x] spec.md 작성
- [x] plan.md 작성
- [x] task.md 작성 (이 파일)
- [-] 백로그 업데이트 — spec-x 는 phase 표 갱신 N/A (queue.md 는 sdd 가 자동 관리)
- [x] 사용자 Plan Accept

---

## Task 1: 브랜치 생성

### 1-1. feature 브랜치 체크아웃
- [x] `git checkout -b spec-x-rebrand-vision`
- [x] Commit: 없음 (브랜치 생성만)

---

## Task 2: README.md 전면 재작성

### 2-1. 새 비전 / Phase 분할 / 비교표 반영
- [x] `README.md` 전체 교체 — 제목 / 한 줄 비전 / 핵심 멘탈 모델 / Phase 1~4 표 / 비교표 / 현재 상태
- [x] 옛 이름 (`html-to-ppt`) 흔적 제거
- [x] 수동 검증: 30초 진입 테스트 통과 — 처음 보는 사람이 비전과 단계를 이해할 수 있는가
- [x] Commit: `docs(spec-x-rebrand-vision): rewrite README with scene-flow vision`

---

## Task 3: docs/planning.md 전면 재작성

### 3-1. 옛 Phase 1~4 / 디렉토리 구조 / 확장 아이디어 제거
- [x] 옛 내용 일괄 삭제

### 3-2. 새 Phase 1~4 정의 + Scene Event Log + A/C 보류 정책
- [x] 비전 섹션 (HTML scene base + overlay)
- [x] Phase 1 (Scene Engine) — 정의 / 진입 조건 / 산출물 / 독립 가치
- [x] Phase 2 (Recording) — 정의 + Scene Event Log JSONL 예시 + A/C 보류 정책
- [x] Phase 3 (Composition) — ffmpeg pipeline + 자막 sync 전략
- [x] Phase 4 (AI Automation) — script→scene / TTS / 자동 자막
- [x] Open Questions — A/C 최종 결정, Scene IR 형태, 렌더 엔진 선택
- [x] 수동 검증: README Phase 표와 1:1 매칭, Scene Event Log 명문화 확인
- [x] Commit: `docs(spec-x-rebrand-vision): redefine phases and introduce scene event log`

---

## Task 4: 옛 이름 흔적 정리 (Chore)

### 4-1. 저장소 grep + 정리
- [x] grep 실행 — 결과: 본 SPEC 문서 (spec/plan/task) 내부에서 *과거 사실 / 명령 패턴 인용* 으로만 hit. 사용자 문서 / 코드 잔재 0건.
- [-] 발견된 모든 위치를 `scene-flow` 또는 새 비전 문구로 치환 / 삭제 — **사유**: hit 가 모두 메타 컨텍스트 (배경 설명 / grep 패턴 자체) 라 정리 대상이 아님.
- [x] 재검증: 사용자 문서 / 코드 (`README.md`, `docs/`, `CLAUDE.md`) 에서 0건 확인.
- [-] Commit — **사유**: 변경 없음. task.md 마킹만 Ship commit 에 묶어 처리.

---

## Task 5: Ship

> 작업 task 완료 후 `/hk-ship` 절차를 따릅니다.

- [-] 코드 품질 점검 (lint / type check) — docs only, N/A
- [-] 전체 테스트 실행 — docs only, constitution §9.1 예외 적용
- [-] 통합 테스트 — Integration Test Required = no
- [x] **walkthrough.md 작성** (증거 로그)
- [x] **pr_description.md 작성** (템플릿 준수)
- [x] **Ship Commit**: `docs(spec-x-rebrand-vision): ship walkthrough and pr description`
- [x] **Push**: `git push -u origin spec-x-rebrand-vision`
- [x] **PR 생성**: `gh pr create` 또는 `/hk-pr-gh` 로 생성
- [x] **사용자 알림**: 푸시 완료 + PR URL 보고

---

## 진행 요약

| 항목 | 값 |
|---|---|
| **총 Task 수** | 5 (Pre-flight 별도) |
| **예상 commit 수** | 3~4 (README / planning / 이름정리(선택) / ship) |
| **현재 단계** | Ship |
| **마지막 업데이트** | 2026-05-10 |
