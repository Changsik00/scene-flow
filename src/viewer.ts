import Reveal from 'reveal.js';
import 'reveal.js/dist/reveal.css';
import 'reveal.js/dist/theme/black.css';
import { parseScene } from './ir/parser.ts';

const SCENE_URL = '/scenes/hello.md';

async function bootstrap(): Promise<void> {
  const slidesEl = document.getElementById('slides');
  if (!slidesEl) {
    throw new Error('#slides 컨테이너를 찾지 못했습니다.');
  }

  const md = await fetch(SCENE_URL).then((res) => {
    if (!res.ok) {
      throw new Error(`scene 로드 실패: ${SCENE_URL} (${res.status})`);
    }
    return res.text();
  });

  const ir = parseScene(md);
  if (ir.meta.title) {
    document.title = ir.meta.title;
  }
  slidesEl.innerHTML = ir.sections.join('\n');

  const deck = new Reveal({
    hash: true,
    controls: true,
    progress: true,
  });
  await deck.initialize();
}

bootstrap().catch((err: unknown) => {
  // eslint-disable-next-line no-console
  console.error('[scene-flow] bootstrap 실패:', err);
});
