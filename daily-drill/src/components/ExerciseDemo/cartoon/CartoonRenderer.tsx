import { useRef, useState } from 'react';
import { useAnimationFrame } from 'framer-motion';
import type { DemoRendererProps } from '../types';
import { cartoonExercises, idle } from './exercises';
import { BODY, GROUND_Y, VIEWBOX, buildSkeleton, sample, type Vec } from './rig';
import { Figure } from './Figure';

const FEET_AT: Vec = { x: 88, y: GROUND_Y - BODY.soleDrop };

export function CartoonRenderer({ slug, playing, speed }: DemoRendererProps) {
  const ex = cartoonExercises[slug] ?? idle;
  const phase = useRef(0);
  const [, setTick] = useState(0);

  useAnimationFrame((_, delta) => {
    if (!playing) return;
    // Clamp so a backgrounded tab doesn't jump several reps on return.
    const dt = Math.min(delta, 100) / 1000;
    phase.current = (phase.current + (dt * speed) / ex.repSeconds) % 1;
    setTick((n) => (n + 1) % 1_000_000);
  });

  const pose = sample(ex, phase.current);
  const skeleton = buildSkeleton(pose, ex.anchor, ex.anchorAt ?? FEET_AT);

  return (
    <svg viewBox={`0 0 ${VIEWBOX} ${VIEWBOX}`} className="block h-full w-full" aria-hidden>
      <Figure skeleton={skeleton} headDeg={pose.head} nearFootDeg={pose.nearFoot} farFootDeg={pose.farFoot} />
    </svg>
  );
}
