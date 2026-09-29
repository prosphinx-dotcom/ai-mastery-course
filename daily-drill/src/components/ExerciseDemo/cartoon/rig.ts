/**
 * A 2D forward-kinematics rig for the cartoon figure.
 *
 * Angles are absolute, in degrees, measured from "pointing straight down":
 *   0 = down, 90 = forward (the figure faces right), 180 = up, -90 = back.
 * Keyframes store one angle per segment; the renderer eases between them,
 * which is equivalent to rotating each joint.
 */

export interface Pose {
  torso: number;
  head: number;
  nearUpperArm: number;
  nearForearm: number;
  farUpperArm: number;
  farForearm: number;
  nearThigh: number;
  nearShin: number;
  nearFoot: number;
  farThigh: number;
  farShin: number;
  farFoot: number;
}

export type Easing = (t: number) => number;

export const easeInOutCubic: Easing = (t) =>
  t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
export const easeInOutSine: Easing = (t) => -(Math.cos(Math.PI * t) - 1) / 2;

export interface Keyframe {
  /** Normalised time within one rep, 0..1. First must be 0, last must be 1. */
  at: number;
  pose: Pose;
  /** Easing for the segment that ends at this keyframe. */
  ease?: Easing;
}

/** Which body point stays fixed to the ground while the rest moves. */
export type Anchor = 'feet' | 'hands';

export interface CartoonExercise {
  slug: string;
  name: string;
  anchor: Anchor;
  /** Seconds per rep at speed 1. */
  repSeconds: number;
  keyframes: Keyframe[];
  /** Where the anchor sits in the viewBox. Defaults to the standing-feet mark. */
  anchorAt?: Vec;
}

export interface Vec {
  x: number;
  y: number;
}

/** Segment lengths and radii in viewBox units (viewBox is 200 × 200). */
export const BODY = {
  torso: 50,
  neck: 6,
  headR: 15,
  upperArm: 30,
  forearm: 28,
  handR: 5,
  thigh: 42,
  shin: 40,
  foot: 17,
  soleDrop: 5.5, // ankle height above the ground
} as const;

export const VIEWBOX = 200;
export const GROUND_Y = 186;

/** Far-side limbs are nudged back and up to fake a slight 3/4 camera. */
export const FAR_OFFSET: Vec = { x: -3.5, y: -2.5 };

const rad = (deg: number) => (deg * Math.PI) / 180;
export const dir = (deg: number): Vec => ({ x: Math.sin(rad(deg)), y: Math.cos(rad(deg)) });
const add = (a: Vec, b: Vec): Vec => ({ x: a.x + b.x, y: a.y + b.y });
const along = (from: Vec, deg: number, len: number): Vec => add(from, scale(dir(deg), len));
const scale = (v: Vec, k: number): Vec => ({ x: v.x * k, y: v.y * k });

export interface Limb {
  root: Vec;
  mid: Vec;
  end: Vec;
  tip?: Vec;
}

export interface Skeleton {
  hip: Vec;
  shoulder: Vec;
  head: Vec;
  nearArm: Limb;
  farArm: Limb;
  nearLeg: Limb & { tip: Vec };
  farLeg: Limb & { tip: Vec };
}

function solve(p: Pose, hip: Vec): Skeleton {
  const shoulder = along(hip, p.torso, BODY.torso);
  const head = along(shoulder, p.head, BODY.neck + BODY.headR);

  const arm = (s: Vec, upper: number, fore: number): Limb => {
    const mid = along(s, upper, BODY.upperArm);
    return { root: s, mid, end: along(mid, fore, BODY.forearm) };
  };
  const leg = (h: Vec, thigh: number, shin: number, foot: number) => {
    const mid = along(h, thigh, BODY.thigh);
    const end = along(mid, shin, BODY.shin);
    return { root: h, mid, end, tip: along(end, foot, BODY.foot) };
  };

  const farShoulder = add(shoulder, FAR_OFFSET);
  const farHip = add(hip, FAR_OFFSET);
  return {
    hip,
    shoulder,
    head,
    nearArm: arm(shoulder, p.nearUpperArm, p.nearForearm),
    farArm: arm(farShoulder, p.farUpperArm, p.farForearm),
    nearLeg: leg(hip, p.nearThigh, p.nearShin, p.nearFoot),
    farLeg: leg(farHip, p.farThigh, p.farShin, p.farFoot),
  };
}

/**
 * Solve the pose, then translate the whole figure so the anchor point sits
 * at `anchorAt`. This keeps planted feet (or hands) glued to the floor no
 * matter how the joints above them rotate.
 */
export function buildSkeleton(p: Pose, anchor: Anchor, anchorAt: Vec): Skeleton {
  const probe = solve(p, { x: 0, y: 0 });
  const pinned = anchor === 'feet' ? probe.nearLeg.end : probe.nearArm.end;
  return solve(p, { x: anchorAt.x - pinned.x, y: anchorAt.y - pinned.y });
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Pose at normalised rep time `phase` (0..1). */
export function sample(ex: CartoonExercise, phase: number): Pose {
  const kfs = ex.keyframes;
  const t = ((phase % 1) + 1) % 1;
  let i = 1;
  while (i < kfs.length - 1 && kfs[i]!.at < t) i++;
  const a = kfs[i - 1]!;
  const b = kfs[i]!;
  const span = b.at - a.at;
  const local = span <= 0 ? 1 : (t - a.at) / span;
  const k = (b.ease ?? easeInOutCubic)(Math.min(1, Math.max(0, local)));
  const out = {} as Pose;
  for (const key of Object.keys(a.pose) as (keyof Pose)[]) {
    out[key] = lerp(a.pose[key], b.pose[key], k);
  }
  return out;
}
