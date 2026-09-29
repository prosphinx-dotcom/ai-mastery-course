import { easeInOutSine, type CartoonExercise, type Pose } from '../rig';

const stand: Pose = {
  torso: 180,
  head: 180,
  nearUpperArm: 6,
  nearForearm: 16,
  farUpperArm: -2,
  farForearm: 8,
  nearThigh: 0,
  nearShin: 0,
  nearFoot: 90,
  farThigh: 0,
  farShin: 0,
  farFoot: 90,
};

// Thighs just past parallel, knees tracking over toes, chest up at ~35°,
// arms reaching forward as a counterbalance.
const bottom: Pose = {
  torso: 146,
  head: 158,
  nearUpperArm: 96,
  nearForearm: 92,
  farUpperArm: 90,
  farForearm: 88,
  nearThigh: 84,
  nearShin: -33,
  nearFoot: 90,
  farThigh: 81,
  farShin: -31,
  farFoot: 90,
};

/** Bodyweight squat — ~0.65s down, brief pause, ~0.6s drive up. */
export const squat: CartoonExercise = {
  slug: 'squat',
  name: 'Bodyweight Squat',
  anchor: 'feet',
  repSeconds: 1.5,
  keyframes: [
    { at: 0, pose: stand },
    { at: 0.08, pose: stand },
    { at: 0.52, pose: bottom },
    { at: 0.6, pose: bottom },
    { at: 1, pose: stand, ease: easeInOutSine },
  ],
};
