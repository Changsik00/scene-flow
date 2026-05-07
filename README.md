# html-to-ppt

> HTML로 만드는 프레젠테이션 — 슬라이드, PDF, 영상, 자막까지 하나의 파이프라인으로.

---

## 왜 HTML로 PPT를?

PowerPoint나 Keynote는 강력하지만 닫혀 있다. HTML은 열려 있다.

| | 기존 PPT 도구 | html-to-ppt |
|---|:---:|:---:|
| 버전 관리 (Git) | ✗ | ✓ |
| 브라우저에서 바로 실행 | ✗ | ✓ |
| PDF 출력 | ✓ | ✓ |
| 영상(MP4) 직출 | △ | ✓ |
| 자막 자동 생성 | ✗ | ✓ |
| 코드/애니메이션 자유도 | ✗ | ✓ |

---

## 핵심 기능

- **슬라이드 엔진** — HTML + CSS Animation. 키보드·스와이프 네비게이션, 풀스크린
- **PDF 출력** — 브라우저 인쇄 모드(`@media print`). 별도 도구 불필요
- **Markdown 소스** — `.md` 파일로 슬라이드 작성, `---`로 페이지 구분
- **DESIGN.md** — 테마·색상·폰트를 명세 파일 하나로 관리, CSS 변수 자동 주입
- **영상 출력** — 브라우저 녹화(`MediaRecorder`) 또는 Puppeteer + ffmpeg 파이프라인
- **자막 지원** — 발표자 노트 → SRT/VTT 변환, YouTube 업로드 준비

---

## 전체 파이프라인

```
DESIGN.md  ←──── 테마 명세
    │
    ▼
slides.md  ←──── 콘텐츠 작성 (Markdown)
    │
    ├──→  HTML 슬라이드  ──→  브라우저 발표
    │           ├──→  PDF (인쇄 모드)
    │           └──→  PNG 시퀀스 (Puppeteer)
    │                       │
    │                  ffmpeg ──→  MP4
    │                                │
    └──→  SRT 자막  ──────────────→  YouTube
```

---

## 문서

- [기획 및 아이디어](docs/planning.md)

---

## 유사 프로젝트

- [Reveal.js](https://revealjs.com/) — 기능이 많고 무거움
- [Marp](https://marp.app/) — 심플하지만 커스터마이징 제한
- [Slidev](https://sli.dev/) — Vue 의존

**차별점**: 프레임워크 의존 없음 + DESIGN.md 기반 명세 + ffmpeg 영상 파이프라인.
