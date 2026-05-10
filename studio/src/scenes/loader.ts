import { parseScene, type SceneIR } from '../ir/parser';

export interface LoadedScenes {
  sections: string[];
  scenes: SceneIR[];
  keys: string[];
}

export function loadAllScenes(modules: Record<string, string>): LoadedScenes {
  const keys = Object.keys(modules).sort();
  const scenes = keys.map((k) => parseScene(modules[k]));
  const sections = scenes.flatMap((s) => s.sections);
  return { sections, scenes, keys };
}
