import Reveal from 'reveal.js';
import 'reveal.js/dist/reveal.css';
import 'reveal.js/dist/theme/black.css';
import { loadAllScenes } from './scenes/loader';

const sceneModules = import.meta.glob('./scenes/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

async function bootstrap(): Promise<void> {
  const slidesEl = document.getElementById('slides');
  if (!slidesEl) {
    throw new Error('#slides 컨테이너를 찾지 못했습니다.');
  }

  const { sections, scenes } = loadAllScenes(sceneModules);
  if (sections.length === 0) {
    throw new Error('scene 파일을 찾지 못했습니다 (studio/src/scenes/*.md).');
  }

  const firstTitle = scenes[0]?.meta.title;
  if (firstTitle) {
    document.title = firstTitle;
  }
  slidesEl.innerHTML = sections.join('\n');

  const deck = new Reveal({
    hash: true,
    controls: true,
    progress: true,
    loop: false,
  });
  await deck.initialize();
}

bootstrap().catch((err: unknown) => {
  // eslint-disable-next-line no-console
  console.error('[scene-flow] bootstrap 실패:', err);
});
