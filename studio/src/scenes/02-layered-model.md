---
title: layered overlay 모델
---

# Layered Overlay

scene-flow 의 핵심 멘탈 모델.

<div class="grid-demo" style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-top:1.5rem;text-align:left;font-size:0.9em">
  <div style="padding:1rem;border:1px solid #888;border-radius:0.5rem">
    <strong>HTML scene = base</strong><br/>
    재현 가능 / git diff / AI 친화 / 코드
  </div>
  <div style="padding:1rem;border:1px solid #888;border-radius:0.5rem">
    <strong>녹화·음성·자막 = overlay</strong><br/>
    사람이 진행 / 후처리 / 영상
  </div>
</div>

**최종 산출물 = base + overlay 의 합성**.
