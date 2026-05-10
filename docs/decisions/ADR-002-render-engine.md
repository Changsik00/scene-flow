# ADR-002: 렌더 엔진 — Reveal.js 위에 얹기

| 항목 | 값 |
|---|---|
| **Status** | Accepted |
| **결정일** | 2026-05-10 |
| **결정 SPEC** | `spec-01-01-bootstrap-viewer` |
| **결정 단위** | scene-flow 전체 (phase-1 / phase-2 / phase-3 의 viewer 동작에 직접 영향) |
| **참조** | `docs/planning.md` Open Questions §5.3, ADR-001 |

## Context

scene-flow 의 **Scene IR** (ADR-001 — Markdown + inline HTML) 을 *브라우저에서 보여주는* 엔진을 결정해야 한다. phase-1 의 성공 기준은:

1. 단일 / 다중 scene 표시
2. 키보드 / 풀스크린 네비게이션
3. CSS 애니메이션 ≥3종 + fragment 등장
4. PDF 출력 (`@media print`)
5. 위 1~4 가 한 흐름으로 동작

본 ADR 은 이 5 가지 + 후속 phase (phase-2 Recording / Event Log, phase-3 Composition) 의 요구를 동시에 만족시킬 *렌더링 기반* 을 정한다.

### 평가 축

| 축 | 의미 |
|---|---|
| **즉시성** | phase-1 의 다섯 기능을 얼마나 빨리 동작시킬 수 있는가 |
| **PDF 호환** | `@media print` / page-break 가 정확히 떨어지는가 |
| **Event Log 후킹** | phase-2 에서 *어느 scene 에서 무슨 행동이 있었는지* 메타데이터 로깅이 자연스러운가 |
| **이주 비용** | 결정이 잘못되었을 때 다른 엔진으로 갈아탈 비용 |
| **의존성 규모** | 코어가 얼마나 가벼운가 |

### Alternatives 검토

| 옵션 | 즉시성 | PDF | Event Log 후킹 | 이주 비용 | 의존성 |
|---|:---:|:---:|:---:|:---:|:---:|
| **(a) Reveal.js 위에 얹기** | ★★★ | ★★★ | ★★ | ★★ | 1 (`reveal.js`) |
| (b) Remotion | ★ | ★ | ★ | ★★★ | 다수 (React 강제) |
| (c) 자체 구현 (Vanilla / Svelte) | ★ | ★ | ★★★ | ★★★ | 0 |
| (d) Reveal.js 플러그인 형태 | ★★ | ★★★ | ★★★ | ★★ | 1 (+ 플러그인 코드) |

## Decision

**Reveal.js 위에 얹기** — `src/viewer.ts` 가 Reveal API 를 호출하고, IR 파서가 생성한 `<section>` markup 을 Reveal 의 `.slides` 영역에 주입한다.

```
Scene IR (MD+HTML)  →  src/ir/parser.ts  →  <section>...</section>  →  Reveal.js
                                              ↑                          ↑
                                           Reveal 비종속              Reveal 종속 (격리)
```

### 격리 정책 (Encapsulation Policy)

본 결정의 위험을 줄이기 위해 **Reveal 종속을 `src/viewer.ts` 한 곳에만 둔다**:

- `src/ir/` 는 Reveal 을 모름. 입력 = MD 문자열, 출력 = `<section>` HTML 문자열 + `SceneMeta`.
- `src/viewer.ts` 만 `import Reveal from 'reveal.js'` 를 포함.
- 후속 phase 의 Event Log / 자막 sync 도 가능한 한 IR 메타 + 시간축 만으로 동작하게 설계 — Reveal 이벤트는 `viewer.ts` 에서 *어댑트* 하여 추상 이벤트로 변환.

이 정책 덕에, 점진 이주 시 영향 범위가 `viewer.ts` 1 파일로 축소된다.

### 점진 이주 정책 (Migration Policy)

본 결정은 *영구* 가 아니다. 다음 트리거가 발생하면 단계적으로 이주:

| 트리거 | 다음 단계 |
|---|---|
| phase-2 에서 Event Log 후킹이 *Reveal 의 이벤트 모델로 어색해짐* (예: fragment 단계 이벤트가 부족하거나 timing 정밀도 떨어짐) | (d) **Reveal 플러그인 형태** 로 이주 — Reveal 을 그대로 두고, scene-flow 만의 후킹 / 이벤트 dispatch 를 플러그인으로 묶음. viewer.ts 가 플러그인 코드로 분리. |
| 플러그인으로도 표현이 부자연스러움 (예: 다중 scene 동시 렌더, scene-level animation timeline 통합 등 phase-3 합성 시) | (c) **자체 viewer 구현** — Reveal 제거. 의존성 0. IR 파서는 그대로 재사용. viewer.ts 가 직접 DOM / 키 / 풀스크린 / fragment 처리. |

각 단계는 *별도 ADR + spec* 으로 진행. 본 ADR 은 그 길을 막지 않는다.

## Consequences

### Positive

- **즉시 동작**: phase-1 성공 기준 5 가지 (단일/다중 scene, 키보드, 애니, PDF, 통합) 가 Reveal 의 기본 기능으로 거의 충족. 첫 PR 머지까지의 시간이 자체 구현 대비 매우 짧음.
- **PDF 검증된 동작**: Reveal 의 `?print-pdf` 모드가 이미 잘 동작. 별도 stylesheet 작성 부담 ↓.
- **풍부한 생태계**: 테마 / 플러그인 / 예제. 후속 phase 의 *디자인* spec 에서 차용 가능.
- **scene-flow 차별점은 viewer 위쪽** (IR / Event Log / Composition / AI) 에 집중 가능 — Reveal 이 아래쪽을 책임지므로.

### Negative

- **의존성 1개 추가** (`reveal.js`) — 의도적, 검증된 라이브러리.
- **Event Log 후킹이 Reveal 의 이벤트 모델 (`slidechanged`, `fragmentshown` 등) 에 의존**. 이게 부족하면 (d) 플러그인으로 이주 필요. → *예측된 이주 경로*, 본 ADR 의 정책으로 관리.
- **Reveal 의 디자인 / 동작 컨벤션이 scene-flow 의 멘탈 모델과 가끔 충돌 가능** (예: section 안의 section = vertical slide). → IR 파서가 *flat scene 모델* 만 다루도록 정책화 (vertical slide 는 본 phase 범위 밖).
- **Reveal 자체의 버그 / 한계가 그대로 노출**. → 이슈 발생 시 fork or 플러그인 으로 우회.

### 후속 phase 영향

| Phase | 영향 |
|---|---|
| phase-1 (Scene Engine) | viewer = Reveal init + IR 주입. 키 / 애니 / PDF 모두 Reveal 위에서 구현. |
| phase-2 (Recording) | Reveal 의 `Reveal.on('slidechanged', …)`, `Reveal.on('fragmentshown', …)` 를 후킹해 Event Log 이벤트로 변환. *Reveal 이벤트 모델이 IR 의 fragment / animation 을 다 표현 못 하면 (d) 이주 트리거.* |
| phase-3 (Composition) | Reveal 의 timeline 자체는 사용 안 함 (composition 은 ffmpeg). Reveal 은 *재렌더링 모드* 에서만 활용. |
| phase-4 (AI) | 무관 — IR 만 생성하면 됨. |

## 거부된 이유 (요약)

- **(b) Remotion**: 발표 모드가 약함 (영상 렌더 중심). phase-1 의 "라이브 발표" 와 결이 안 맞음. 단, phase-3 의 *재렌더링 / 영상 합성* 단계에선 후보로 재검토 가치 있음 (별도 ADR).
- **(c) 자체 구현 (지금 시점)**: 작업량 폭발 위험. phase-1 viewer 자체에 시간 다 쓰면 phase-2 (Event Log — 차별점) 가 늦어짐. 단, *미래 옵션* 으로 본 ADR 의 이주 정책에 명시.
- **(d) Reveal 플러그인 (지금 시점)**: (a) 보다 통합 복잡도 ↑, 즉시성 ↓. *Event Log 후킹이 어색해질 때 자연스러운 다음 단계*.

## 변경 / 폐기 절차

본 ADR 의 변경은 위 점진 이주 정책에 따라 **새 ADR (예: ADR-NNN-render-engine-migrate-to-...) 작성** 으로 처리.

- 본 ADR 의 Status → `Superseded by ADR-NNN`.
- 이주 spec (예: `spec-N-MM-render-migration`) 에서 viewer.ts 교체.
- IR 파서 / Event Log 추상은 *변경되지 않아야* 함 — 그래야 격리 정책의 가치가 실현됨.
