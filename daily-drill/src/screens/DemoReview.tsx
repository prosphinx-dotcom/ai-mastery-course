import { motion } from 'framer-motion';
import { ExerciseDemo } from '../components/ExerciseDemo';

/**
 * Review screen for the design-system + sample-exercise checkpoint.
 * Mirrors the real exercise-detail screen so it can be judged in context.
 * Replaced by the app shell once the direction is approved.
 */

const CUES = [
  'Feet shoulder-width, toes slightly out',
  'Sit hips back and down, chest proud',
  'Knees track over toes — thighs to parallel',
  'Drive through the whole foot to stand tall',
];

const SWATCHES = [
  { name: 'Volt', cls: 'bg-volt', note: 'Action · streak' },
  { name: 'Heat', cls: 'bg-heat', note: 'Work interval' },
  { name: 'Cool', cls: 'bg-cool', note: 'Rest interval' },
  { name: 'Hydro', cls: 'bg-hydro', note: 'Water' },
  { name: 'Deload', cls: 'bg-deload', note: 'Week 4' },
];

const rise = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { delay: 0.06 * i, duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } }),
};

export function DemoReview() {
  return (
    <main className="mx-auto flex min-h-full max-w-md flex-col gap-8 px-5 pt-[max(env(safe-area-inset-top),1.5rem)] pb-28">
      <motion.header initial="hidden" animate="show" custom={0} variants={rise}>
        <p className="eyebrow">Day 1 · Lower body · Week 1</p>
        <h1 className="display mt-2 text-6xl">
          Bodyweight
          <br />
          <span className="text-volt">Squat</span>
        </h1>
      </motion.header>

      <motion.div initial="hidden" animate="show" custom={1} variants={rise}>
        <ExerciseDemo slug="squat" name="Bodyweight Squat" />
      </motion.div>

      <motion.section initial="hidden" animate="show" custom={2} variants={rise} className="grid grid-cols-3 gap-3">
        {[
          ['40s', 'Work'],
          ['20s', 'Rest'],
          ['×3', 'Rounds'],
        ].map(([value, label]) => (
          <div key={label} className="rounded-2xl bg-ink-900 px-4 py-4 ring-1 ring-ink-700/60">
            <div className="numeric text-3xl">{value}</div>
            <div className="eyebrow mt-1">{label}</div>
          </div>
        ))}
      </motion.section>

      <motion.section initial="hidden" animate="show" custom={3} variants={rise}>
        <h2 className="eyebrow mb-3">Coaching cues</h2>
        <ol className="flex flex-col gap-3">
          {CUES.map((cue, i) => (
            <li key={cue} className="flex items-start gap-4 rounded-2xl bg-ink-900 p-4 text-[17px] leading-snug">
              <span className="numeric grid size-8 shrink-0 place-items-center rounded-full bg-volt-tint text-volt">{i + 1}</span>
              <span className="pt-1">{cue}</span>
            </li>
          ))}
        </ol>
      </motion.section>

      <motion.section initial="hidden" animate="show" custom={4} variants={rise}>
        <h2 className="eyebrow mb-3">Design system</h2>
        <div className="grid grid-cols-5 gap-2">
          {SWATCHES.map((s) => (
            <div key={s.name} className="flex flex-col gap-2">
              <div className={`${s.cls} aspect-square rounded-xl`} />
              <div className="text-xs font-semibold">{s.name}</div>
              <div className="text-[11px] leading-tight text-fg-faint">{s.note}</div>
            </div>
          ))}
        </div>
      </motion.section>

      <motion.button
        initial="hidden"
        animate="show"
        custom={5}
        variants={rise}
        whileTap={{ scale: 0.97 }}
        type="button"
        className="display sticky bottom-6 h-16 w-full rounded-full bg-volt text-2xl text-ink-950 shadow-xl shadow-black/50"
      >
        Start drill
      </motion.button>
    </main>
  );
}
