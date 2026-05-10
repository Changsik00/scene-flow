import { parseScene, type SceneIR, type Transition } from '../ir/parser';

export interface LoadedScenes {
  sections: string[];
  scenes: SceneIR[];
  keys: string[];
}

function withTransition(section: string, transition: Transition | undefined): string {
  if (!transition) return section;
  return section.replace(/^<section>/, `<section data-transition="${transition}">`);
}

export function loadAllScenes(modules: Record<string, string>): LoadedScenes {
  const keys = Object.keys(modules).sort();
  const scenes = keys.map((k) => parseScene(modules[k]));
  const sections = scenes.map((s) => withTransition(s.sections[0], s.meta.transition));
  return { sections, scenes, keys };
}
