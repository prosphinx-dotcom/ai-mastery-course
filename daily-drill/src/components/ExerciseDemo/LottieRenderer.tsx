import { useEffect, useRef } from 'react';
import type { AnimationItem } from 'lottie-web';
import type { DemoRendererProps } from './types';
import { loadLottieJson } from './resolveRenderer';

/**
 * Plays src/assets/exercises/<slug>.json. The player (lottie_light: SVG
 * renderer, no expression eval) and the JSON are both lazy-loaded, so apps
 * without a Lottie pack pay nothing for this backend.
 */
export function LottieRenderer({ slug, playing, speed }: DemoRendererProps) {
  const host = useRef<HTMLDivElement>(null);
  const anim = useRef<AnimationItem | null>(null);
  const latest = useRef({ playing, speed });
  latest.current = { playing, speed };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [{ default: lottie }, data] = await Promise.all([
        import('lottie-web/build/player/lottie_light'),
        loadLottieJson(slug),
      ]);
      if (cancelled || !host.current || !data) return;
      const a = lottie.loadAnimation({
        container: host.current,
        renderer: 'svg',
        loop: true,
        autoplay: false,
        animationData: data,
        rendererSettings: { preserveAspectRatio: 'xMidYMid meet' },
      });
      anim.current = a;
      a.setSpeed(latest.current.speed);
      if (latest.current.playing) a.play();
    })();
    return () => {
      cancelled = true;
      anim.current?.destroy();
      anim.current = null;
    };
  }, [slug]);

  useEffect(() => {
    anim.current?.setSpeed(speed);
  }, [speed]);

  useEffect(() => {
    if (!anim.current) return;
    if (playing) anim.current.play();
    else anim.current.pause();
  }, [playing]);

  return <div ref={host} className="h-full w-full [&>svg]:block" aria-hidden />;
}
