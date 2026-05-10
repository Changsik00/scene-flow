import { describe, expect, it } from 'vitest';
import { parseScene } from '../src/ir/parser';

describe('parseScene', () => {
  it('단순 헤더 + 본문을 section markup 으로 변환한다', () => {
    const md = '# 제목\n\n본문 내용';
    const ir = parseScene(md);

    expect(ir.sections).toHaveLength(1);
    expect(ir.sections[0]).toMatch(/^<section>/);
    expect(ir.sections[0]).toMatch(/<\/section>$/);
    expect(ir.sections[0]).toContain('<h1>제목</h1>');
    expect(ir.sections[0]).toContain('본문 내용');
  });

  it('inline HTML 을 그대로 보존한다', () => {
    const md = [
      '# 그리드 데모',
      '',
      '<div class="grid" style="display:grid">',
      '  <div>왼쪽</div>',
      '  <div>오른쪽</div>',
      '</div>',
    ].join('\n');
    const ir = parseScene(md);

    expect(ir.sections[0]).toContain('<div class="grid" style="display:grid">');
    expect(ir.sections[0]).toContain('<div>왼쪽</div>');
    expect(ir.sections[0]).toContain('<div>오른쪽</div>');
  });

  it('frontmatter 를 추출하고 본문에서 분리한다', () => {
    const md = [
      '---',
      'title: Hello scene-flow',
      '---',
      '',
      '# 본문 제목',
      '',
      '내용',
    ].join('\n');
    const ir = parseScene(md);

    expect(ir.meta.title).toBe('Hello scene-flow');
    expect(ir.sections[0]).toContain('<h1>본문 제목</h1>');
    expect(ir.sections[0]).not.toContain('---');
    expect(ir.sections[0]).not.toContain('title: Hello');
  });

  it('frontmatter 의 transition 키를 추출한다 (Reveal 표준 값만)', () => {
    const md = ['---', 'title: A', 'transition: zoom', '---', '# Body'].join('\n');
    const ir = parseScene(md);
    expect(ir.meta.transition).toBe('zoom');
  });

  it('transition 의 잘못된 값은 무시한다 (undefined 유지)', () => {
    const md = ['---', 'transition: invalid-value', '---', '# Body'].join('\n');
    const ir = parseScene(md);
    expect(ir.meta.transition).toBeUndefined();
  });
});
