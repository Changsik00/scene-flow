import MarkdownIt from 'markdown-it';

export interface SceneMeta {
  title?: string;
}

export interface SceneIR {
  sections: string[];
  meta: SceneMeta;
}

const md = new MarkdownIt({
  html: true,
  linkify: true,
  breaks: false,
});

const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/;

function parseFrontmatter(input: string): { meta: SceneMeta; body: string } {
  const match = input.match(FRONTMATTER_RE);
  if (!match) {
    return { meta: {}, body: input };
  }

  const yaml = match[1];
  const body = input.slice(match[0].length);
  const meta: SceneMeta = {};

  for (const line of yaml.split(/\r?\n/)) {
    const kv = line.match(/^([A-Za-z_][\w-]*)\s*:\s*(.*)$/);
    if (!kv) continue;
    const key = kv[1];
    const value = kv[2].trim().replace(/^['"](.*)['"]$/, '$1');
    if (key === 'title') {
      meta.title = value;
    }
  }

  return { meta, body };
}

export function parseScene(input: string): SceneIR {
  const { meta, body } = parseFrontmatter(input);
  const html = md.render(body).trim();
  return {
    sections: [`<section>${html}</section>`],
    meta,
  };
}
