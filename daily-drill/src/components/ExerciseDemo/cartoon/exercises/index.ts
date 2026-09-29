import type { CartoonExercise, Pose } from '../rig';
import { easeInOutSine } from '../rig';
import { squat } from './squat';

/** Built-in cartoon demos, keyed by exercise slug. */
export const cartoonExercises: Record<string, CartoonExercise> = {
  [squat.slug]: squat,
};

const rest: Pose = {
  torso: 180, head: 180,
  nearUpperArm: 5, nearForearm: 12, farUpperArm: -3, farForearm: 6,
  nearThigh: 0, nearShin: 0, nearFoot: 90, farThigh: 2, farShin: -1, farFoot: 90,
};
const inhale: Pose = { ...rest, torso: 178.5, head: 177, nearUpperArm: 7, farUpperArm: -1 };

/** Gentle breathing loop shown for exercises without a demo yet. */
export const idle: CartoonExercise = {
  slug: 'idle',
  name: 'Ready',
  anchor: 'feet',
  repSeconds: 3.2,
  keyframes: [
    { at: 0, pose: rest },
    { at: 0.5, pose: inhale, ease: easeInOutSine },
    { at: 1, pose: rest, ease: easeInOutSine },
  ],
};
