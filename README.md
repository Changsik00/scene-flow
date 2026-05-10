# scene-flow

> HTML 을 base layer 로 한 **layered presentation & video pipeline**.
> scene 을 만들고, 발표하면서 녹화하고, 그 위에 음성·자막을 덮어 최종 콘텐츠를 뽑는다.

---

## 핵심 멘탈 모델

```
   ┌─────────────────────────────────────────┐
   │  Phase 4 — AI Automation (선택)           │   script → scene, TTS, 자동 자막
   ├─────────────────────────────────────────┤
   │  Phase 3 — Composition                  │   ffmpeg + 자막 sync → 최종 MP4
   ├─────────────────────────────────────────┤
   │  Phase 2 — Recording                    │   화면 + 음성 + Scene Event Log
   ├─────────────────────────────────────────┤
   │  Phase 1 — Scene Engine  (= base)       │   HTML scene + browser viewer + PDF
   └─────────────────────────────────────────┘
        ↑ HTML 이 모든 레이어의 기준
```

- **HTML scene = base layer** — 재현 가능 / git diff 가능 / AI 친화 / 코드.
- **녹화 · 음성 · 자막 = overlay layer** — 사람이 진행 / 후처리 / 영상.
- **최종 산출물 = base + overlay 의 합성**.

PPT / Reveal.js 처럼 *발표만* 하는 도구도 아니고, Loom 처럼 *녹화만* 하는 도구도 아니다.
**둘을 분리해서 쌓는다** — 그래서 라이브로 발표한 영상도 나중에 scene 부분만 4K 로 갈아끼울 수 있다.

---

## 단계별 가치 (각 phase 가 거기서 멈춰도 의미가 있음)

| Phase | 이름 | 만들면 무엇이 가능한가 | 단독 가치 |
|:---:|---|---|---|
| **1** | Scene Engine | HTML / Markdown 으로 scene 작성 → 브라우저 발표 → PDF 출력 | "Reveal.js 대안" |
| **2** | Recording | 발표하면서 화면 + 마이크 녹화 + Scene Event Log 기록 | "Loom for developers" |
| **3** | Composition | 녹화본 + Event Log + 자막 → ffmpeg 로 합성, scene 부분 재렌더링 가능 | "creator pipeline" |
| **4** | AI Automation | 주제 / 스크립트 → scene 자동 생성, TTS 음성, 자동 자막 | "AI content factory" |

> 각 phase 의 정의 / 진입 조건 / 산출물 / 결정되지 않은 부분 → [docs/planning.md](docs/planning.md)

---

## 핵심 무기 — Scene Event Log

녹화할 때 *scene 이 무엇을 했는지* 를 메타데이터로 같이 기록한다:

```jsonl
{"t": 0.00, "event": "scene-start", "id": "intro"}
{"t": 12.40, "event": "fragment", "scene": "intro", "step": 1}
{"t": 18.90, "event": "scene-change", "to": "tcp-handshake"}
{"t": 45.20, "event": "highlight", "selector": "#syn-arrow"}
```

이게 있으면:

- **자막 자동 sync** — Whisper 가 뽑은 timestamp 와 scene 이벤트가 같은 시간축이라 부담 없이 매칭.
- **scene 부분만 재렌더링** — 라이브 음성은 그대로 두고 scene 만 4K HTML 로 갈아끼우기.
- **하이라이트 / 챕터 자동 생성** — scene-change 가 곧 챕터 구분점.

일반 화면 녹화 (= "그냥 픽셀") 가 못 하는 부분이다.

---

## 비교

| | scene-flow | Reveal.js / Marp | Loom | Remotion |
|---|:---:|:---:|:---:|:---:|
| HTML scene 발표 | ✓ | ✓ | ✗ | △ (코드형) |
| 화면 + 음성 녹화 | ✓ | ✗ | ✓ | ✗ |
| Scene Event Log | ✓ | ✗ | ✗ | ✗ |
| ffmpeg 후합성 / 재렌더링 | ✓ | ✗ | ✗ | ✓ |
| AI 자동 생성 (선택) | ✓ | ✗ | ✗ | △ |
| CLI / 로컬 우선 | ✓ | △ | ✗ | ✓ |

scene-flow 의 차별점은 **layered overlay 모델 + Scene Event Log** — 발표 도구와 영상 파이프라인을 한 축으로 묶었다.

---

## 현재 상태

- `phase-01` (Scene Engine) **진행 중** — `spec-01-01` (IR + 렌더 결정 + 최소 viewer) Merged, `spec-01-02` (저장소 구조 정리) 진행.
- 본 저장소는 [harness-kit](https://github.com/) 거버넌스를 따른다 — `/hk-align` 으로 SDD 세션 시작.

## 프로젝트 구조

```
scene-flow/
├── README.md / CLAUDE.md            ← 진입점
├── studio/                          ← 코드 (Vite + TypeScript + Reveal.js, pnpm)
│   ├── package.json / pnpm-lock.yaml
│   ├── src/  public/  test/
│   └── tsconfig.json / vite.config.ts
├── specs/                           ← SDD 작업 로그
├── backlog/                         ← phase / queue
└── docs/                            ← ADR, planning
    └── decisions/                   ← ADR-001 ~ 003
```

> 코드 작업은 `cd studio && pnpm run dev` (또는 `build` / `test`).
> 저장소 구조 결정 → [`docs/decisions/ADR-003-repository-structure.md`](docs/decisions/ADR-003-repository-structure.md)

## 문서

- [기획 / Phase 정의 / 결정되지 않은 사항](docs/planning.md)
- [ADR 모음](docs/decisions/) — Scene IR (001), Render Engine (002), Repository Structure (003)
