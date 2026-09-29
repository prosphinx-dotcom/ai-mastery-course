import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { CartoonRenderer } from './cartoon/CartoonRenderer';
import { LottieRenderer } from './LottieRenderer';
import { resolveBackend } from './resolveRenderer';
import { SLOW_MO_SPEED, type DemoBackend, type DemoRenderer } from './types';

const RENDERERS: Record<DemoBackend, DemoRenderer> = {
  lottie: LottieRenderer,
  cartoon: CartoonRenderer,
};

export interface ExerciseDemoProps {
  slug: string;
  /** Human name, used for the accessible label. */
  name: string;
  autoPlay?: boolean;
  /** Hide the control bar (e.g. small thumbnails in lists). */
  controls?: boolean;
  /** Dev/testing override; production code lets the resolver decide. */
  backend?: DemoBackend;
  className?: string;
}

/**
 * Square, self-sizing exercise demonstration. Fills its parent's width.
 * Backend is picked per slug: a Lottie file in src/assets/exercises/ wins,
 * otherwise the built-in cartoon rig draws it. Controls are identical.
 */
export function ExerciseDemo({ slug, name, autoPlay = true, controls = true, backend, className = '' }: ExerciseDemoProps) {
  const reduceMotion = useReducedMotion();
  const [playing, setPlaying] = useState(autoPlay && !reduceMotion);
  const [slow, setSlow] = useState(false);
  const which = backend ?? resolveBackend(slug);
  const Renderer = RENDERERS[which];

  return (
    <figure className={`w-full overflow-hidden rounded-[var(--radius-card)] bg-ink-900 ${className}`} data-backend={which}>
      <div className="relative aspect-square w-full">
      {/* spotlight stage: lifts dark garments off the background */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(60% 55% at 50% 45%, #26262c 0%, #16161a 60%, #111113 100%)' }}
      />
      <button
        type="button"
        className="absolute inset-0 cursor-pointer"
        onClick={() => setPlaying((p) => !p)}
        aria-label={`${name} demonstration, ${playing ? 'playing' : 'paused'}. Tap to ${playing ? 'pause' : 'play'}.`}
      >
        <Renderer slug={slug} playing={playing} speed={slow ? SLOW_MO_SPEED : 1} />
      </button>
      </div>

      {/* Controls live below the stage so they never cover the figure's feet. */}
      {controls && (
        <figcaption className="flex items-center justify-between gap-3 border-t border-ink-700/60 p-3">
          <motion.button
            type="button"
            whileTap={{ scale: 0.92 }}
            onClick={() => setPlaying((p) => !p)}
            className="grid size-14 place-items-center rounded-full bg-fg text-ink-950 shadow-lg shadow-black/40"
            aria-label={playing ? 'Pause demo' : 'Play demo'}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.svg
                key={playing ? 'pause' : 'play'}
                viewBox="0 0 24 24"
                className="size-6"
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={{ duration: 0.14 }}
                fill="currentColor"
              >
                {playing ? (
                  <path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" />
                ) : (
                  <path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z" />
                )}
              </motion.svg>
            </AnimatePresence>
          </motion.button>

          <motion.button
            type="button"
            whileTap={{ scale: 0.95 }}
            onClick={() => setSlow((s) => !s)}
            aria-pressed={slow}
            className={`flex h-12 items-center gap-2 rounded-full px-5 text-sm font-semibold transition-colors duration-200 ${
              slow ? 'bg-volt text-ink-950' : 'bg-ink-800 text-fg ring-1 ring-ink-700'
            }`}
          >
            <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round">
              <circle cx="12" cy="13" r="8" />
              <path d="M12 9v4l2.5 1.5M9.5 2.5h5" />
            </svg>
            Slow-mo
          </motion.button>
        </figcaption>
      )}
    </figure>
  );
}
