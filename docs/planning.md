# 기획 및 아이디어

html-to-ppt 프로젝트의 상세 기획, 아이디어, 로드맵을 기록하는 문서.
아이디어가 생길 때마다 자유롭게 추가한다.

---

## 핵심 아이디어 상세

### 슬라이드 엔진 (HTML + CSS Animation)

각 슬라이드는 `<section>` 하나. CSS `@keyframes`와 `transition`으로 등장·전환 효과를 구현.

```
slide-enter    → 콘텐츠가 아래에서 올라오는 효과
slide-fade     → 서서히 나타나는 효과
slide-zoom     → 중앙에서 확대되며 등장
highlight-seq  → 텍스트 항목이 순서대로 강조되는 효과
```

### PDF 출력 (브라우저 인쇄 모드)

```css
@media print {
  .slide { page-break-after: always; }
  .animation-only { display: none; }
}
```

브라우저 인쇄 → "PDF로 저장" → 완성. 별도 도구 불필요.
DESIGN.md의 테마가 PDF에도 그대로 반영됨.

### Markdown → 슬라이드 변환

```markdown
---
theme: dark-minimal
font: Pretendard
accent: "#6366f1"
---

# 제목 슬라이드
## 부제목

---

## 두 번째 슬라이드

- 항목 1  <!-- .fragment → 클릭마다 하나씩 등장 -->
- 항목 2
- 항목 3
```

`---` 구분자로 슬라이드 구분, 프론트매터로 테마 지정.
주석(HTML comment)으로 애니메이션 트리거 제어 가능.

### DESIGN.md 기반 테마 시스템

`DESIGN.md`는 디자인 명세 파일이자 실행 가능한 설정 소스.

```markdown
# DESIGN.md

## Theme: dark-minimal

- Background: #0f0f0f
- Primary:    #ffffff
- Accent:     #6366f1
- Font:       Pretendard, 16px/1.6
- Ratio:      16:9
- Transition: slide-up 0.4s ease
```

파서가 이 파일을 읽어 CSS 변수로 변환 → HTML, PDF, 영상 모두 동일한 디자인 유지.

### 영상 출력 (녹화 + ffmpeg)

#### 방법 A — 브라우저 녹화

`MediaRecorder API`로 슬라이드 화면을 직접 캡처.
애니메이션과 전환 효과가 그대로 녹화됨. 실시간 발표 녹화에 적합.

#### 방법 B — ffmpeg 파이프라인 (자동화)

각 슬라이드를 PNG로 렌더링(Puppeteer) → ffmpeg로 영상 조합.

```bash
# 슬라이드 → PNG 시퀀스
puppeteer render slides/ --output frames/

# PNG → MP4 (슬라이드당 5초)
ffmpeg -framerate 1/5 -i frames/slide_%03d.png \
       -c:v libx264 -r 30 -pix_fmt yuv420p output.mp4

# 자막 합성
ffmpeg -i output.mp4 -vf subtitles=subtitles.srt final.mp4
```

슬라이드별 체류 시간을 `slides.md`에 메타데이터로 지정 가능:
```markdown
<!-- duration: 8s -->
## 이 슬라이드는 8초간 표시됩니다
```

### 자막 파이프라인

```
슬라이드 소스 (MD)
  ↓  발표자 노트 추출
slides.md의 Note: 섹션
  ↓  타임스탬프 계산 (duration 메타데이터 기준)
subtitles.srt / subtitles.vtt
  ↓
ffmpeg 합성 or YouTube 자막 업로드
```

---

## 확장 아이디어 (Icebox)

- **실시간 미리보기**: `.md` 파일 저장 시 브라우저 자동 갱신
- **코드 하이라이팅**: `code-focus` 템플릿 — 특정 라인 강조하며 설명
- **인터랙티브 슬라이드**: 청중 투표(WebSocket), Q&A 모드
- **CLI 도구**: `npx html-to-ppt slides.md` 한 줄로 실행
- **AI 자막 생성**: 영상 → Whisper → SRT 자동 생성 후 슬라이드에 역싱크
- **다국어 자막**: 하나의 발표로 여러 언어 자막 자동 번역
- **OBS 연동**: OBS의 브라우저 소스로 슬라이드 직접 연결 → 라이브 방송
- **템플릿 마켓**: 커뮤니티 테마/템플릿 공유 레지스트리

---

## 구현 로드맵

### Phase 1 — 기반 (MVP)
- [ ] HTML 슬라이드 뷰어 (키보드 네비게이션, 풀스크린)
- [ ] CSS 애니메이션 기본 세트 (fade, slide-up, zoom, highlight-seq)
- [ ] 다크/라이트 테마 2종
- [ ] `@media print` PDF 출력

### Phase 2 — Markdown 파이프라인
- [ ] MD → HTML 파서 구현 (`---` 구분, 프론트매터)
- [ ] `DESIGN.md` 파싱 → CSS 변수 주입
- [ ] 발표자 노트 분리 (슬라이드 뷰 하단 표시)
- [ ] `.fragment` 주석 → 클릭 등장 애니메이션

### Phase 3 — 영상 출력
- [ ] `MediaRecorder` 기반 브라우저 녹화 + 다운로드
- [ ] Puppeteer PNG 렌더링 (headless)
- [ ] ffmpeg 파이프라인 (슬라이드 → MP4, 슬라이드별 duration 지원)
- [ ] SRT 자막 생성 및 ffmpeg 합성

### Phase 4 — 고급 기능
- [ ] 실시간 미리보기 서버 (파일 watch → 브라우저 자동 갱신)
- [ ] 코드 하이라이팅 슬라이드 템플릿
- [ ] CLI 도구 (`npx html-to-ppt`)
- [ ] OBS 브라우저 소스 최적화 모드

---

## 디렉토리 구조 (목표)

```
html-to-ppt/
├── README.md
├── DESIGN.md              # 기본 테마 명세 예시
├── docs/
│   └── planning.md        # 이 문서
├── themes/                # CSS 테마
│   ├── dark-minimal.css
│   └── light-clean.css
├── templates/             # 슬라이드 레이아웃
│   ├── title.html
│   ├── two-column.html
│   └── code-focus.html
├── src/
│   ├── parser.js          # MD → HTML 변환
│   ├── renderer.js        # Puppeteer PNG 렌더
│   └── exporter.js        # ffmpeg 파이프라인
├── example/
│   ├── slides.md
│   └── output/
└── index.html             # 슬라이드 뷰어
```
