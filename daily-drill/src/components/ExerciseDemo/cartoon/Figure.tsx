import { useId } from 'react';
import { BODY, GROUND_Y, type Limb, type Skeleton, type Vec } from './rig';
import { FAR, FEATURE, HAIR, HEADBAND, NEAR, type Material, type Palette } from './materials';

/* ---------- geometry ---------- */

/** Light comes from above and slightly in front of the figure. */
const LIGHT: Vec = { x: 0.45, y: -0.89 };

/**
 * Outline of a tapered capsule lying along +x from (0,0) with radius r1 to
 * (len,0) with radius r2: two circles joined by their outer tangents.
 */
function capsulePath(len: number, r1: number, r2: number): string {
  const L = Math.max(len, Math.abs(r1 - r2) + 0.01);
  const s = (r1 - r2) / L;
  const c = Math.sqrt(1 - s * s);
  const f = (n: number) => n.toFixed(2);
  const large2 = s < 0 ? 1 : 0;
  const large1 = s > 0 ? 1 : 0;
  return [
    `M${f(r1 * s)} ${f(-r1 * c)}`,
    `L${f(L + r2 * s)} ${f(-r2 * c)}`,
    `A${r2} ${r2} 0 ${large2} 1 ${f(L + r2 * s)} ${f(r2 * c)}`,
    `L${f(r1 * s)} ${f(r1 * c)}`,
    `A${r1} ${r1} 0 ${large1} 1 ${f(r1 * s)} ${f(-r1 * c)}Z`,
  ].join('');
}

function frame(a: Vec, b: Vec) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy);
  const theta = Math.atan2(dy, dx);
  // The gradient runs across the limb along local -y. Flip the local frame
  // when that side faces away from the light, so highlights stay on top.
  const facing = Math.sin(theta) * LIGHT.x - Math.cos(theta) * LIGHT.y;
  const deg = (theta * 180) / Math.PI;
  const transform = `translate(${a.x.toFixed(2)} ${a.y.toFixed(2)}) rotate(${deg.toFixed(2)})${facing < 0 ? ' scale(1 -1)' : ''}`;
  return { len, transform };
}

const towards = (a: Vec, b: Vec, t: number): Vec => ({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t });

/* ---------- primitives ---------- */

interface CapsuleProps {
  a: Vec;
  b: Vec;
  r1: number;
  r2: number;
  mat: string; // gradient id
  stroke: string;
}

function Capsule({ a, b, r1, r2, mat, stroke }: CapsuleProps) {
  const { len, transform } = frame(a, b);
  return (
    <path
      d={capsulePath(len, r1, r2)}
      transform={transform}
      fill={`url(#${mat})`}
      stroke={stroke}
      strokeWidth={0.8}
      strokeLinejoin="round"
    />
  );
}

function Gradient({ id, m }: { id: string; m: Material }) {
  return (
    <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor={m.hi} />
      <stop offset="0.42" stopColor={m.base} />
      <stop offset="1" stopColor={m.lo} />
    </linearGradient>
  );
}

/* ---------- body parts ---------- */

type Ids = Record<'skin' | 'shirt' | 'shorts' | 'shoe', string>;

function Arm({ limb, ids, pal }: { limb: Limb; ids: Ids; pal: Palette }) {
  const hand = towards(limb.mid, limb.end, 1 + 3 / BODY.forearm);
  return (
    <g>
      <Capsule a={limb.mid} b={limb.end} r1={5.2} r2={4} mat={ids.skin} stroke={pal.skin.lo} />
      <circle cx={hand.x} cy={hand.y} r={BODY.handR} fill={`url(#${ids.skin})`} stroke={pal.skin.lo} strokeWidth={0.8} />
      <Capsule a={limb.root} b={limb.mid} r1={6.6} r2={5.3} mat={ids.skin} stroke={pal.skin.lo} />
      {/* short sleeve */}
      <Capsule a={limb.root} b={towards(limb.root, limb.mid, 0.42)} r1={7.8} r2={7} mat={ids.shirt} stroke={pal.shirt.lo} />
    </g>
  );
}

function Shoe({ at, deg, ids, pal }: { at: Vec; deg: number; ids: Ids; pal: Palette }) {
  return (
    <g transform={`translate(${at.x.toFixed(2)} ${at.y.toFixed(2)}) rotate(${(deg - 90).toFixed(2)})`}>
      <path
        d="M-5 -5.2 Q1.5 -8.6 7.5 -4.8 Q15.5 -3.4 18 1.2 L18 3.6 L-6.6 3.6 Q-8 -1 -5 -5.2Z"
        fill={`url(#${ids.shoe})`}
        stroke={pal.shoe.lo}
        strokeWidth={0.8}
        strokeLinejoin="round"
      />
      <rect x={-7} y={2.6} width={25.6} height={3} rx={1.5} fill={pal.sole} />
    </g>
  );
}

function Leg({ limb, footDeg, ids, pal }: { limb: Limb & { tip: Vec }; footDeg: number; ids: Ids; pal: Palette }) {
  return (
    <g>
      <Capsule a={limb.mid} b={limb.end} r1={7.6} r2={5} mat={ids.skin} stroke={pal.skin.lo} />
      <Shoe at={limb.end} deg={footDeg} ids={ids} pal={pal} />
      <Capsule a={limb.root} b={limb.mid} r1={10.4} r2={7.6} mat={ids.skin} stroke={pal.skin.lo} />
      {/* shorts leg */}
      <Capsule a={limb.root} b={towards(limb.root, limb.mid, 0.52)} r1={11.4} r2={9.8} mat={ids.shorts} stroke={pal.shorts.lo} />
    </g>
  );
}

function Head({ at, deg, uid, skinId }: { at: Vec; deg: number; uid: string; skinId: string }) {
  const r = BODY.headR;
  return (
    <g transform={`translate(${at.x.toFixed(2)} ${at.y.toFixed(2)}) rotate(${(180 - deg).toFixed(2)})`}>
      <defs>
        <clipPath id={`${uid}-skull`}>
          <circle r={r + 0.4} />
        </clipPath>
        <radialGradient id={`${uid}-face`} cx="0.62" cy="0.34" r="0.75">
          <stop offset="0" stopColor={NEAR.skin.hi} />
          <stop offset="0.5" stopColor={NEAR.skin.base} />
          <stop offset="1" stopColor={NEAR.skin.lo} />
        </radialGradient>
      </defs>
      {/* nose sits behind the skull outline so it reads as one shape */}
      <ellipse cx={r - 0.6} cy={2.2} rx={2.6} ry={2.3} fill={`url(#${skinId})`} stroke={NEAR.skin.lo} strokeWidth={0.8} />
      <circle r={r} fill={`url(#${uid}-face)`} stroke={NEAR.skin.lo} strokeWidth={0.8} />
      <g clipPath={`url(#${uid}-skull)`}>
        <path d="M6.8 -13.6 A15.6 15.6 0 0 0 -10 12.2 L-6.5 6.8 Q-3.5 -5.5 6.8 -13.6Z" fill={HAIR.base} />
        <path d="M2 -14.2 Q-6 -12 -11 -5" stroke={HAIR.hi} strokeWidth={1.6} strokeLinecap="round" fill="none" />
        <rect x={-17} y={-9.6} width={34} height={4.4} transform="rotate(-7)" fill={HEADBAND} />
      </g>
      <ellipse cx={-1.8} cy={1.2} rx={2.7} ry={3.5} fill={NEAR.skin.base} stroke={NEAR.skin.lo} strokeWidth={0.8} />
      <ellipse cx={8.6} cy={-1.2} rx={1.5} ry={2} fill={FEATURE} />
      <path d="M8.6 6.4 Q10.8 8 12.8 6.2" stroke={FEATURE} strokeWidth={0.9} strokeLinecap="round" fill="none" />
    </g>
  );
}

/* ---------- figure ---------- */

export interface FigureProps {
  skeleton: Skeleton;
  headDeg: number;
  nearFootDeg: number;
  farFootDeg: number;
}

export function Figure({ skeleton: s, headDeg, nearFootDeg, farFootDeg }: FigureProps) {
  const uid = useId().replace(/:/g, '');
  const near: Ids = { skin: `${uid}-ns`, shirt: `${uid}-nt`, shorts: `${uid}-np`, shoe: `${uid}-nf` };
  const far: Ids = { skin: `${uid}-fs`, shirt: `${uid}-ft`, shorts: `${uid}-fp`, shoe: `${uid}-ff` };
  const shadow = `${uid}-shadow`;
  const blur = `${uid}-blur`;

  // Contact shadow follows the figure's footprint on the floor.
  const xs = [s.hip.x, s.nearLeg.end.x, s.nearLeg.tip.x, s.farLeg.end.x];
  const minX = Math.min(...xs) - 8;
  const maxX = Math.max(...xs) + 6;

  const neckBase = s.shoulder;
  const shirtStart = towards(s.hip, s.shoulder, 0.1);
  const pelvisTop = towards(s.hip, s.shoulder, 0.24);

  return (
    <g>
      <defs>
        {(['skin', 'shirt', 'shorts', 'shoe'] as const).map((k) => (
          <g key={k}>
            <Gradient id={near[k]} m={NEAR[k]} />
            <Gradient id={far[k]} m={FAR[k]} />
          </g>
        ))}
        <filter id={shadow} x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0.8" dy="1.4" stdDeviation="1.3" floodColor="#000" floodOpacity="0.45" />
        </filter>
        <filter id={blur} x="-20%" y="-200%" width="140%" height="500%">
          <feGaussianBlur stdDeviation="2.2" />
        </filter>
      </defs>

      {/* floor */}
      <line x1={14} x2={186} y1={GROUND_Y + 0.5} y2={GROUND_Y + 0.5} stroke="#ffffff" strokeOpacity={0.07} />
      <ellipse
        cx={(minX + maxX) / 2}
        cy={GROUND_Y}
        rx={(maxX - minX) / 2}
        ry={3.6}
        fill="#000"
        opacity={0.55}
        filter={`url(#${blur})`}
      />

      {/* far side — drawn first so everything else overlaps it */}
      <Arm limb={s.farArm} ids={far} pal={FAR} />
      <Leg limb={s.farLeg} footDeg={farFootDeg} ids={far} pal={FAR} />

      {/* trunk + head */}
      <g filter={`url(#${shadow})`}>
        <Capsule a={s.hip} b={pelvisTop} r1={12.6} r2={12.6} mat={near.shorts} stroke={NEAR.shorts.lo} />
        <Capsule a={shirtStart} b={s.shoulder} r1={12.4} r2={13.4} mat={near.shirt} stroke={NEAR.shirt.lo} />
        <Capsule a={neckBase} b={s.head} r1={5} r2={5} mat={near.skin} stroke={NEAR.skin.lo} />
        <Head at={s.head} deg={headDeg} uid={uid} skinId={near.skin} />
      </g>

      {/* near side — casts a soft shadow onto the trunk behind it */}
      <g filter={`url(#${shadow})`}>
        <Leg limb={s.nearLeg} footDeg={nearFootDeg} ids={near} pal={NEAR} />
      </g>
      <g filter={`url(#${shadow})`}>
        <Arm limb={s.nearArm} ids={near} pal={NEAR} />
      </g>
    </g>
  );
}
