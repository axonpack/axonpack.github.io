'use client';

import { useRef, type ReactNode } from 'react';

import { HeroRidges } from '@/components/hero-ridges';

/**
 * Publishes the pointer's position across the hero as `--mx` / `--my`, each -0.5 to 0.5 from the
 * centre. The background and the panel read those in CSS, so one listener drives both and nothing
 * re-renders. Both default to 0, which is what a touch device and a keyboard get.
 */
export function HeroStage({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  const track = (x: number, y: number) => {
    const el = ref.current;
    if (!el) return;
    const box = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${(x - box.left) / box.width - 0.5}`);
    el.style.setProperty('--my', `${(y - box.top) / box.height - 0.5}`);
  };

  const rest = () => {
    ref.current?.style.setProperty('--mx', '0');
    ref.current?.style.setProperty('--my', '0');
  };

  return (
    <div
      ref={ref}
      onPointerMove={(event) => track(event.clientX, event.clientY)}
      onPointerLeave={rest}
      className="relative isolate"
    >
      <svg
        aria-hidden="true"
        className="dots pointer-events-none absolute inset-0 -z-10 size-full text-fd-muted-foreground opacity-[0.22] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_72%)]"
      >
        <defs>
          <pattern id="hero-dots" width="26" height="26" patternUnits="userSpaceOnUse">
            <circle cx="1.5" cy="1.5" r="1.5" fill="currentColor" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hero-dots)" />
      </svg>
      <HeroRidges />
      {children}
    </div>
  );
}
