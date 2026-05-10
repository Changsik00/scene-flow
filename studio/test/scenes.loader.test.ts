import { describe, expect, it } from 'vitest';
import { loadAllScenes } from '../src/scenes/loader';

describe('loadAllScenes', () => {
  it('키를 알파벳 순으로 정렬한다 (입력 순서 무시)', () => {
    const modules: Record<string, string> = {
      './scenes/03-c.md': '# Third\n',
      './scenes/01-a.md': '# First\n',
      './scenes/02-b.md': '# Second\n',
    };
    const result = loadAllScenes(modules);
    expect(result.keys).toEqual([
      './scenes/01-a.md',
      './scenes/02-b.md',
      './scenes/03-c.md',
    ]);
  });

  it('각 scene 의 sections 를 평탄화하여 모은다', () => {
    const modules: Record<string, string> = {
      './scenes/01-a.md': '# A',
      './scenes/02-b.md': '# B',
      './scenes/03-c.md': '# C',
    };
    const result = loadAllScenes(modules);
    expect(result.sections).toHaveLength(3);
    expect(result.scenes).toHaveLength(3);
    // 정렬된 순서대로 sections 배치
    expect(result.sections[0]).toContain('<h1>A</h1>');
    expect(result.sections[1]).toContain('<h1>B</h1>');
    expect(result.sections[2]).toContain('<h1>C</h1>');
  });

  it('빈 입력에 대해 빈 결과를 반환한다', () => {
    const result = loadAllScenes({});
    expect(result.keys).toEqual([]);
    expect(result.sections).toEqual([]);
    expect(result.scenes).toEqual([]);
  });

  it('각 scene 의 frontmatter title 메타를 보존한다', () => {
    const modules: Record<string, string> = {
      './scenes/01-a.md': '---\ntitle: First\n---\n# Body A',
      './scenes/02-b.md': '---\ntitle: Second\n---\n# Body B',
    };
    const result = loadAllScenes(modules);
    expect(result.scenes[0].meta.title).toBe('First');
    expect(result.scenes[1].meta.title).toBe('Second');
  });

  it('frontmatter transition 이 있으면 section 에 data-transition 을 주입한다', () => {
    const modules: Record<string, string> = {
      './scenes/01-a.md': '---\ntransition: fade\n---\n# A',
    };
    const result = loadAllScenes(modules);
    expect(result.sections[0]).toMatch(/^<section data-transition="fade">/);
  });

  it('transition 이 없으면 data-transition 속성을 추가하지 않는다', () => {
    const modules: Record<string, string> = {
      './scenes/01-a.md': '# A',
    };
    const result = loadAllScenes(modules);
    expect(result.sections[0]).toMatch(/^<section>/);
    expect(result.sections[0]).not.toContain('data-transition');
  });
});
