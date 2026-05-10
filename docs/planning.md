# 기획 / Phase 정의 / 결정되지 않은 사항

> scene-flow 의 비전 / 단계별 목표 / 핵심 컨셉 / 아직 결정하지 못한 것들을 기록한다.
> 새로운 아이디어는 자유롭게 추가한다. 결정이 필요한 것은 "Open Questions" 섹션에 모은다.

---

## 1. 비전

scene-flow 는 **HTML 을 base layer 로 둔 layered presentation & video pipeline** 이다.

전통적인 도구는 보통 한 층만 다룬다:

- PPT / Keynote / Reveal.js → *발표* 만
- Loom / OBS → *녹화* 만
- Premiere / Final Cut → *편집* 만
- Synthesia / HeyGen → *AI 영상 생성* 만

scene-flow 는 이걸 **분리된 레이어로 쌓는다**:

```
Phase 4 (선택)   AI Automation         script → scene, TTS, 자동 자막
Phase 3          Composition           ffmpeg + 자막 sync → 최종 영상
Phase 2          Recording             화면 + 음성 + Scene Event Log
Phase 1 (base)   Scene Engine          HTML scene + viewer + PDF
```

각 phase 는 *위 phase 가 없어도 독립적으로 가치를 가진다*. Phase 1 만 써도 Reveal.js 대안이고, Phase 1+2 면 "developer 용 Loom" 이고, Phase 1+2+3 이면 creator pipeline 이고, 전부면 AI content factory 다.

---

## 2. Phase 정의

### Phase 1 — Scene Engine

> HTML 로 scene 을 만들고 발표하고 PDF 로 뽑는다. **이게 base layer**.

- **목적**: scene 의 IR (intermediate representation) 을 HTML 로 굳히고, 발표 / 출력 / 후속 phase 가 모두 이걸 공유하게 한다.
- **진입 조건**: 비전 문서 굳음 (= 본 SPEC 통과 후).
- **산출물** (모두 `studio/` 안 — ADR-003):
  - `studio/src/ir/` — Markdown + inline HTML 파서 (ADR-001)
  - `studio/src/viewer.ts` — Reveal.js 위 viewer (ADR-002, 점진 이주 정책)
  - `studio/public/scenes/*.md` — scene 파일들
  - 브라우저에서 키보드 / 풀스크린 발표
  - CSS 애니메이션 / fragment 등장
  - PDF 출력 (`@media print` 활용)
- **독립 가치**: Reveal.js / Marp / Slidev 의 자리. 발표 도구로 끝.
- **출구 조건**: scene 작성부터 발표 / PDF 까지 한 사이클이 돈다.

### Phase 2 — Recording Layer

> 발표하면서 화면 + 음성을 녹화한다. **그 위에 scene 의 행동 메타데이터 (Event Log) 를 함께 기록한다** — 이게 핵심 무기.

- **목적**: ephemeral 한 발표 행위를 reproducible 한 데이터로 변환.
- **진입 조건**: Phase 1 viewer 가 scene 을 안정적으로 렌더링.
- **산출물**:
  - 화면 + 마이크 녹화 (MediaRecorder 또는 브라우저 외부 캡처 — 사용 보고 결정)
  - **Scene Event Log** (JSONL) — §3 참조
  - 결과물: `recording.webm/mp4` + `events.jsonl`
- **독립 가치**: Loom 같은 화면 녹화기 + scene 메타데이터를 가진 기록. "어디서 무슨 슬라이드를 보여줬는지" 를 시간축으로 남김.
- **출구 조건**: 라이브 발표 → 녹화 + Event Log 가 같이 떨어진다.

### Phase 3 — Composition

> 녹화본 + Event Log + 자막을 합성해 최종 영상을 만든다. 필요시 scene 부분만 깨끗한 HTML 로 재렌더링해 갈아끼운다.

- **목적**: layered 모델의 *합성* 단계. raw 녹화 → 시청 가능한 산출물.
- **진입 조건**: Phase 2 의 Event Log 가 안정적으로 떨어진다.
- **산출물**:
  - ffmpeg pipeline (scene + 음성 + 자막 합성)
  - Whisper 등으로 음성 → SRT/VTT 자막 자동 생성, Event Log 와 timestamp 매칭
  - **Scene Re-render 옵션**: 라이브 음성은 유지하면서 scene 부분만 4K HTML 으로 재렌더링해 갈아끼움 (= Event Log 가 있어 가능)
  - 챕터 / 하이라이트 자동 추출 (Event Log 의 `scene-change` 활용)
- **독립 가치**: creator pipeline. 라이브로 막 발표한 영상도 깔끔한 결과물로.
- **출구 조건**: 발표 → 자동 합성 → YouTube 업로드 가능한 MP4 + SRT.

### Phase 4 — AI Automation (선택)

> 사람이 발표 / 녹음하지 않고도 scene-flow 의 입력을 자동으로 만든다.

- **목적**: 콘텐츠 생산을 사람 의존에서 분리.
- **진입 조건**: Phase 1~3 가 모두 안정적으로 동작.
- **산출물**:
  - 주제 / 스크립트 → scene 자동 생성 (LLM)
  - TTS 음성 합성
  - 자동 다국어 자막
  - Agent orchestration — research / summarize / generate / render 를 CLI 단일 흐름으로
- **독립 가치**: AI content factory. 유튜브 / 강의 / 마케팅 자동화.
- **출구 조건**: "주제 → MP4" 가 한 명령으로 떨어진다.

---

## 3. 핵심 무기 — Scene Event Log

Phase 2 에서 녹화와 함께 떨어지는 메타데이터. 시간축 ↔ scene 행동을 매핑한다.

### 형식 (JSONL)

```jsonl
{"t": 0.00, "event": "recording-start"}
{"t": 0.12, "event": "scene-start", "id": "intro", "html": "intro.html"}
{"t": 12.40, "event": "fragment", "scene": "intro", "step": 1}
{"t": 18.90, "event": "scene-change", "to": "tcp-handshake"}
{"t": 45.20, "event": "highlight", "selector": "#syn-arrow"}
{"t": 51.00, "event": "fragment", "scene": "tcp-handshake", "step": 2}
{"t": 67.30, "event": "scene-change", "to": "summary"}
{"t": 92.10, "event": "recording-end"}
```

### 왜 이게 핵심 무기인가

| 가능해지는 것 | 메커니즘 |
|---|---|
| 자막 자동 sync | Whisper 결과의 timestamp ↔ Event Log 의 timestamp 가 동일 시간축 |
| scene 재렌더링 | 라이브 음성은 유지, scene 만 깨끗한 HTML 으로 갈아끼움 |
| 챕터 자동 생성 | `scene-change` 이벤트가 곧 챕터 분기점 |
| 하이라이트 컴파일 | `highlight` / `fragment` 이벤트만 모아 짧은 클립 자동 생성 |
| 분석 / A-B 테스트 | "어느 scene 에서 얼마 머물렀는지" 로그로 자동 측정 |

일반 화면 녹화에는 픽셀밖에 없다. scene-flow 는 *의미가 붙은 영상*을 만든다.

---

## 4. 디자인 원칙

1. **HTML is the IR**. PPT, MP4, SRT 는 모두 HTML scene 으로부터 파생된다.
2. **Layer 는 분리된 채로 보관**. 녹화 / 음성 / 자막이 base 에 매몰되지 않는다.
3. **CLI / 로컬 우선**. SaaS 가 아니라 개발자형 toolchain. ffmpeg / yt-dlp / whisper / node 와 자연스럽게 연결.
4. **Reproducible by default**. 같은 입력은 같은 결과 — git diff 가능, AI 가 다루기 쉽다.
5. **Progressive enhancement**. Phase 1 만 써도 가치 있고, 더 쌓으면 더 가능해진다.
6. **No vendor lock-in**. PPT / MP4 / HTML / PDF / SRT — 모두 표준 포맷.

---

## 5. Open Questions (결정되지 않은 사항)

> 이 섹션의 항목은 *해당 phase 의 첫 spec 작성 시점에* 결정한다. 미리 결정하지 않는다.

### 5.1 Live overlay (A) vs Post composition (C)

Phase 2 의 녹화 모델:

- **A. Live overlay** — 발표 중 webcam / 마이크가 화면과 통째로 한 영상으로 녹화 (Loom 스타일).
- **C. Hybrid** — 라이브로 한 번 녹화 + raw layer 를 따로 보관 → 후편집에서 합성 (Premiere 스타일).

**현재 정책**: **A 부터 시작 + Scene Event Log 항상 기록 → 부족하면 C 로 확장**.
이유: 한 번에 녹화하는 능력이 가능한지 사용해보면서 결정. Event Log 가 있으면 어느 쪽이든 호환된다 (라이브 음성 유지하면서 scene 부분만 재렌더링 등). 코드 버릴 일 없음.

### 5.2 Scene 소스 형식  ✅ 결정됨 (ADR-001)

- **(b) Markdown + inline HTML** — 작성성 + 자유도 균형. AI 친화. spec-01-01 에서 결정 → `docs/decisions/ADR-001-scene-ir.md`.

### 5.3 렌더 / viewer 엔진  ✅ 결정됨 (ADR-002)

- **(a) Reveal.js 위에 얹기** — 점진 이주 정책 (필요 시 (d) 플러그인 → (c) 자체) 명시. spec-01-01 에서 결정 → `docs/decisions/ADR-002-render-engine.md`.

### 5.4 캡처 메커니즘 (Phase 2)

- (a) 브라우저 내부 `MediaRecorder` (간단, 권한 / 코덱 제약)
- (b) 외부 도구 (OBS, ffmpeg + screen capture) 와 연동 (강력, 설치 부담)
- (c) Headless Chromium + Playwright (자동화 친화, 라이브 발표 약함)

→ phase-02 의 첫 spec 에서 결정.

### 5.5 저장소 구조 / 패키지 매니저  ✅ 결정됨 (ADR-003)

- **저장소 구조**: 거버넌스 (specs/ backlog/ docs/) + 진입점 (README, CLAUDE, .gitignore) + **`studio/`** 컨테이너 (코드 전체).
- **패키지 매니저**: pnpm (corepack 활성).
- **미래 React/Tailwind/shadcn/FSD/front.md**: ADR-003 에 *자리만 명시* — 실제 도입은 phase-3/4 즈음 (오버엔지니어링 회피).
- spec-01-02 에서 결정 → `docs/decisions/ADR-003-repository-structure.md`.

### 5.6 PPT (`.pptx`) export 의 위치

- 비전상 "export target 중 하나" 로 강등됨.
- 실제로 만들 가치가 있는가는 사용자 수요를 보고 결정 — 당장은 우선순위 낮음.

---

## 6. 참고하는 흐름

- **Reveal.js / Marp / Slidev** — HTML slide 발표.
- **Remotion / Motion Canvas** — code-first video 생성.
- **Loom** — 화면 + 음성 캡처 SaaS.
- **Gamma / Tome** — AI slide SaaS.
- **Synthesia / HeyGen** — AI 영상 SaaS.

scene-flow 는 *이들의 어떤 단일 카테고리에도 들어가지 않는다*. 그 사이의 layered pipeline 이 비어 있는 자리.
