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
  - `studio/src/ir/` — Markdown + inline HTML 파서 (ADR-001) + frontmatter `transition` 추출
  - `studio/src/viewer.ts` — Reveal.js 위 viewer (ADR-002, 점진 이주 정책)
  - `studio/src/scenes/` — scene 파일들 (`NN-{slug}.md` 컨벤션, `import.meta.glob` 자동 발견)
  - `studio/src/scenes/loader.ts` — 정렬 + 평탄화 + `data-transition` 주입 (Reveal 비종속*)
  - **컨벤션**: scene 전환 = frontmatter `transition: fade|slide|zoom|...` (Reveal 표준), fragment 등장 = `<li class="fragment">` 인라인 HTML
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

---

## 7. 재검토 (HOLD, 2026-05-10)

> phase-01 완료 후 사용자 회의감으로 트리거된 **재검토 단계**. 추가 phase 진행 *중지*.
> 본 섹션은 *질문을 명확히* 하기 위함 — 답은 공부 / 외부 사례 검토 / 사용자 시나리오 후 결정.

### 7.1 회의감의 진단

phase-01 까지 *부품* (viewer / IR / 다중 scene / transition / fragment / PDF) 은 만들었으나, 다음이 미정의:

| # | 빈 공간 | 구체 질문 |
|---|---|---|
| 1 | **편집 UX** | 사용자가 scene 을 *어디서 어떻게* 만드는가? IDE 에서 MD 직접? chat 으로 AI 생성? studio GUI? 하이브리드? |
| 2 | **AI agent 의 위치** | phase-4 (선택) 가 맞는가, 아니면 *처음부터* 핵심 (사용자 첫 진입점) 인가? |
| 3 | **사용자 시나리오** | "유튜브 5분 강의" / "사내 발표 15분" / "온라인 강의 1시간" 같은 *처음부터 끝까지* 단계별 흐름 부재 |
| 4 | **녹화 ↔ 합성 사이 조작 단계** | 자막 검토는? 부분 재녹화는? 합성 결과 미리보기는? 사람의 *조작 시점* 이 정의 안 됨 |

### 7.2 보강 방향 (답은 공부 후)

#### A. 사용자 시나리오 1~3개 자세히 그리기

처음부터 끝까지 60초 단위 시뮬레이션. 빈 공간이 시각적으로 드러남.

**시나리오 후보**:
- 시나리오 1: dennis 가 *Scene Event Log* 에 대해 5분짜리 유튜브 강의 1편 만들기
- 시나리오 2: 사내 15분 발표 슬라이드 작성 + 녹화 + 자막
- 시나리오 3: 1시간 온라인 강의 시리즈 (10편) 자동화 워크플로우

각 시나리오마다 *시작 트리거 / 작성 도구 / AI 개입 시점 / 녹화 시작 방법 / 실수 대응 / export 위치* 까지 step-by-step 기록.

#### B. 편집 UX 결정 (시나리오 결과로 자연스럽게 도출)

- (a) **MD 직접 편집** — IDE / 텍스트 에디터. 개발자 친화, 비개발자 불편.
- (b) **chat → AI 생성** — 채팅 인터페이스. 비개발자 친화, AI 비용 / 응답 시간.
- (c) **studio GUI** — 시각 편집기 (React 기반). 본격 도구, 개발 비용 큼.
- (d) **하이브리드** — MD + chat AI 보조 + 미리보기. 균형.

#### C. AI agent 의 위치 / 트리거

- phase-4 *선택* 으로 미뤘던 것을 *처음* 으로 옮길 가능성 검토
- 트리거: CLI 명령? chat UI? scene 작성 중 자동 제안?

#### D. Phase 재정의 — *기능* 분할 → *행동* 분할

현재 phase 모델:
- Phase 1 = Scene Engine (기능)
- Phase 2 = Recording (기능)
- Phase 3 = Composition (기능)
- Phase 4 = AI Automation (기능)

대안 — 사용자 *행동* 기반:
- Phase A = "혼자 scene 작성 후 발표" (현재 phase-1 의 일부)
- Phase B = "AI 와 협업으로 scene 작성" (지금까지 비어있음)
- Phase C = "발표하면서 녹화" (phase-2)
- Phase D = "녹화 후 영상 편집/합성" (phase-3)
- Phase E = "주제만 입력 → 자동 영상 생성" (phase-4)

행동 기반은 사용자 가치를 명확히 함. 단 기능 의존성이 *섞임* → trade-off.

### 7.3 외부 사례 벤치마크 (후보)

| 도구 | 카테고리 | 벤치마크 포인트 |
|---|---|---|
| **Gamma** | AI slide SaaS | 편집 UX (chat + GUI 하이브리드), AI 트리거 시점, 결과물 quality |
| **Tome** | AI slide SaaS | 시나리오 (사용자 첫 행동 → 결과), 템플릿 시스템 |
| **Synthesia** | AI 영상 SaaS | 스크립트 → 영상 워크플로우, 편집 단계 정의 |
| **Remotion** | code-first 영상 | 개발자 편집 UX, scene-flow 와 가장 가까운 카테고리 |
| **Loom** | 화면+음성 녹화 SaaS | 녹화 트리거, 자막 검토 UI, share 워크플로우 |

각 도구를 1~2시간씩 직접 사용해보고 *우리 빈 공간 4개* 에 대한 답을 기록.

### 7.4 재개 조건

다음 *모두* 충족 시 HOLD 해제:

- [ ] §7.2 보강 방향 중 *최소 사용자 시나리오 1개* 가 자세히 그려짐 (60초 단위 step-by-step)
- [ ] §7.2 의 A~D 중 *최소 2개* 에 대해 결정 또는 잠정 답 도출
- [ ] 사용자 명시 승인 (HOLD 해제 + 새 phase / spec alignment 시작 동의)

해제 후 다음 작업:
- phase 재정의 결과에 따라 새 phase 시작 (예: phase-02 base branch ON)
- 또는 *기획 보강 spec-x* 를 먼저 진행 (시나리오 / UX 결정을 *문서로 굳히기*)

### 7.5 진행 중지된 작업 (참고)

- phase-02 (Recording Layer)
- phase-03 (Composition)
- phase-04 (AI Automation)

위 3개는 본 재검토 결과에 따라 *유지 / 통합 / 재구성* 가능.
