import type { DemoBackend } from './types';

/**
 * Every JSON dropped into src/assets/exercises/ is discovered at build time.
 * Files are code-split and only fetched (from the local bundle — never the
 * network) when that exercise's demo is shown.
 */
const lottieFiles = import.meta.glob<{ default: unknown }>('../../assets/exercises/*.json');

const bySlug = new Map<string, () => Promise<{ default: unknown }>>(
  Object.entries(lottieFiles).map(([path, load]) => [path.split('/').pop()!.replace(/\.json$/, ''), load]),
);

/** Lottie wins whenever a file exists for the slug; otherwise the cartoon rig. */
export function resolveBackend(slug: string): DemoBackend {
  return bySlug.has(slug) ? 'lottie' : 'cartoon';
}

export async function loadLottieJson(slug: string): Promise<object | null> {
  const load = bySlug.get(slug);
  if (!load) return null;
  const mod = await load();
  return mod.default as object;
}
