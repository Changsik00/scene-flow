# ADR-001: Scene IR 형식 — Markdown + inline HTML

| 항목 | 값 |
|---|---|
| **Status** | Accepted |
| **결정일** | 2026-05-10 |
| **결정 SPEC** | `spec-01-01-bootstrap-viewer` |
| **결정 단위** | scene-flow 전체 (모든 phase 의 base) |
| **참조** | `docs/planning.md` Open Questions §5.2 |

## Context

scene-flow 는 *layered presentation & video pipeline* 이고, 그 가장 아래 base layer 가 **Scene IR (intermediate representation)** 이다. IR 의 형식이 결정되면 그 위에 쌓이는 모든 layer (viewer, Event Log, 자막 sync, AI 자동 생성) 가 이 형식에 맞춰 동작한다. 따라서 **본 결정은 phase-1 ~ phase-4 모두에 영향**.

### 요구사항

- **작성성**: 사람이 직접 쓰기 쉬워야 함 (비기술자 포함).
- **표현력**: 단순 텍스트만이 아니라 그리드 / 차트 / 인터랙션 같은 *복잡 레이아웃* 도 표현 가능해야 함.
- **AI 친화**: phase-4 에서 LLM 이 *생성* 하는 형식이 됨. LLM 이 자연스럽게 만들 수 있어야 함.
- **버전 관리**: git diff 가능. 이진/툴 종속 X.
- **점진 확장 가능**: 나중에 메타 (애니, fragment, transition, duration 등) 가 추가될 때 형식이 부서지지 않아야 함.

### Alternatives 검토

| 옵션 | 작성성 | 표현력 | AI 친화 | 확장성 | 비고 |
|---|:---:|:---:|:---:|:---:|---|
| (a) Markdown only | ★★★ | ★ | ★★★ | ★ | 표현력 한계 (복잡 레이아웃 X) |
| **(b) Markdown + inline HTML** | ★★★ | ★★★ | ★★★ | ★★★ | Reveal.js / Marp / Slidev 의 표준. |
| (c) HTML / MDX 우선 | ★ | ★★★ | ★★ | ★★★ | React 강제, 비기술자 진입 어려움 |
| (d) DSL (YAML/JSON) → HTML 컴파일 | ★★ | ★★ | ★★★ | ★ | DSL 이 못 표현하는 건 막힘. 좁히기 쉬워도 넓히기 어려움. |

## Decision

**Scene IR = Markdown + inline HTML.**

- 80% 의 scene 은 순수 Markdown (`# 제목`, `- 항목`, 본문 텍스트) 으로 충분.
- 20% 의 복잡한 scene 은 인라인 HTML 자유롭게 (`<div class="grid">…</div>` 등).
- frontmatter (`---\ntitle: …\n---`) 로 scene 메타 (title, transition, duration, …) 를 분리.

### IR 예시

```markdown
---
title: TCP 3-way handshake
transition: slide-up
---

# TCP 3-way handshake

먼저 SYN 패킷을 보냅니다.

<div class="diagram" style="display:grid;grid-template-columns:1fr auto 1fr">
  <div>Client</div>
  <div id="syn-arrow">→ SYN</div>
  <div>Server</div>
</div>

- Step 1: SYN
- Step 2: SYN-ACK
- Step 3: ACK
```

## Consequences

### Positive

- **작성 빠름**: MD 기반이라 한 줄 한 줄 쓰는 비용 매우 낮음.
- **표현력 보장**: HTML 의 자유도 그대로 활용 가능 — Reveal/CSS/JS 에 익숙한 사람은 즉시 적용.
- **AI 친화**: LLM 이 가장 자연스럽게 생성하는 두 형식 (MD, HTML) 의 조합. phase-4 에서 prompt 부담 적음.
- **기존 생태계 친화**: Reveal.js / Marp / Slidev 사용자에게 학습 비용 거의 0.
- **메타 확장 가능**: frontmatter 에 키 추가만 하면 됨 (`transition`, `duration`, `notes`, `event-log-tags` 등).

### Negative

- **DSL 만큼 정형 분석은 어려움**: HTML 부분을 LLM 이 파싱하려면 그쪽도 이해해야 함. 단, 이미 LLM 이 HTML 을 잘 다룸.
- **표준 편차 가능**: 같은 의도를 MD vs inline HTML 으로 다르게 쓸 수 있음. → 컨벤션은 후속 spec 에서 권장형으로 정리.
- **렌더 엔진 종속 가능성**: HTML 부분이 특정 렌더러 (예: Reveal) 의 클래스에 의존하면 이주 비용 증가. → ADR-002 의 "Reveal 격리 정책" 으로 완화.

### 영향 범위 — 후속 phase 별

| Phase | 영향 |
|---|---|
| phase-1 (Scene Engine) | IR 파서 (`src/ir/parser.ts`) 가 본 형식을 처리. 본 spec 에서 구현. |
| phase-2 (Recording) | Scene Event Log 가 *scene 단위* 로 발생 — IR 의 frontmatter `id` 또는 자동 생성 ID 와 1:1 매칭. |
| phase-3 (Composition) | 자막 sync — Whisper timestamp ↔ Event Log 의 scene/fragment 이벤트가 본 IR 의 구조에 의존. |
| phase-4 (AI Automation) | LLM 이 본 형식으로 scene 을 *생성*. 본 결정이 prompt template 의 1차 인자. |

## 점진 확장 정책

본 IR 은 *최소 형태* 부터 시작 (frontmatter + MD + inline HTML). 다음과 같은 확장은 후속 spec 에서:

- **fragment 메타**: HTML 주석 (`<!-- fragment -->`) 또는 데이터 속성 (`data-fragment-index`) — `spec-01-03`.
- **animation 메타**: frontmatter 의 `transition`, `enter`, `exit` 키 — `spec-01-03`.
- **scene 분리 구분자**: 다중 scene 한 파일에 둘 때 `---` 구분 (frontmatter 와 충돌 안 하게 정확한 규칙 필요) — `spec-01-02` 즈음.
- **DSL 위 nested**: 필요해지면 IR 위에 *선택적* DSL layer 를 얹을 수 있음 (DSL → MD+HTML 컴파일). 이 ADR 을 부정하지 않음.

## Alternatives 가 거부된 이유 (요약)

- **(a) MD only**: 표현력이 결정적으로 부족. 그리드 / 다이어그램 / 임베드 / 인터랙션이 모두 막힘.
- **(c) HTML/MDX**: 진입 비용이 너무 높음. layered 모델의 *base* 가 무거우면 위 layer 의 가치 (특히 phase-4 AI 생성) 가 약화. React 강제도 부담.
- **(d) DSL**: 좁히기는 쉬워도 넓히기는 어려움. 비전 (programmable content factory) 이 *유연성* 에 강하게 의존. 단, 본 ADR 은 DSL 을 영구 거부하지 않으며, 위 IR 을 *target compile* 하는 선택적 DSL layer 는 후속 phase 에서 가능.

## 변경 / 폐기 절차

본 ADR 을 변경하려면:
1. 새 ADR (예: ADR-NNN) 작성, 본 ADR 의 Status 를 `Superseded by ADR-NNN` 으로 변경.
2. 영향 받는 모든 spec / phase 를 별도 spec 에서 마이그레이션.
3. `docs/planning.md` Open Questions §5.2 갱신.
