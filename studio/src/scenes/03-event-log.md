---
title: Scene Event Log
transition: fade
---

# Scene Event Log

녹화 시 *scene 이 무엇을 했는지* 메타데이터로 기록한다.

```jsonl
{"t": 0.00, "event": "scene-start", "id": "intro"}
{"t": 12.40, "event": "fragment", "scene": "intro", "step": 1}
{"t": 18.90, "event": "scene-change", "to": "tcp-handshake"}
```

이게 있으면 (→ 키로 하나씩 등장):

<ul style="list-style:none;padding:0;margin-top:1.5rem;text-align:left;font-size:0.85em">
  <li class="fragment"><strong>자막 자동 sync</strong> — Whisper timestamp ↔ Event Log 시간축</li>
  <li class="fragment"><strong>scene 재렌더링</strong> — 라이브 음성 유지 + scene 만 4K HTML</li>
  <li class="fragment"><strong>챕터 자동 생성</strong> — <code>scene-change</code> 이벤트가 챕터 분기점</li>
</ul>

일반 화면 녹화 (= 픽셀) 가 못 하는 부분.
