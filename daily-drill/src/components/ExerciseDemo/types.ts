import type { ComponentType } from 'react';

/**
 * The contract every demo backend implements. ExerciseDemo owns layout and
 * controls; a renderer only has to draw `slug` into a square box that fills
 * its parent, and respect `playing` and `speed`.
 */
export interface DemoRendererProps {
  slug: string;
  playing: boolean;
  /** Playback rate. 1 = real tempo, SLOW_MO_SPEED for the slow-motion toggle. */
  speed: number;
}

export type DemoRenderer = ComponentType<DemoRendererProps>;

export type DemoBackend = 'lottie' | 'cartoon';

export const SLOW_MO_SPEED = 0.4;
