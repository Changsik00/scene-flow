---
title: Scene Event Log
---

# Scene Event Log

녹화 시 *scene 이 무엇을 했는지* 메타데이터로 기록한다.

```jsonl
{"t": 0.00, "event": "scene-start", "id": "intro"}
{"t": 12.40, "event": "fragment", "scene": "intro", "step": 1}
{"t": 18.90, "event": "scene-change", "to": "tcp-handshake"}
```

이게 있으면:

- **자막 자동 sync** — Whisper timestamp ↔ Event Log 시간축
- **scene 재렌더링** — 라이브 음성 유지 + scene 만 4K HTML
- **챕터 자동 생성** — `scene-change` 이벤트가 챕터 분기점

일반 화면 녹화 (= 픽셀) 가 못 하는 부분.
