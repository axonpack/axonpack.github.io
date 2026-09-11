import type { CSSProperties } from 'react';

// Atmospheric perspective does the work: the far ridge sits nearest the sky's own colour and is
// blurred, each nearer layer steps darker and sharper. Solid fills rather than one colour at five
// opacities, because stacked alpha muddies wherever two layers overlap.
const ridges = [
  {
    className: 'ridge-far',
    rise: 72,
    fill: 'var(--ridge-1)',
    blur: 3,
    d: 'M0,234 C156,234 156,149 312,149 C450,149 450,236 587,236 C795,236 795,181 1003,181 C1244,181 1244,249 1486,249 L1500,460 L0,460 Z',
  },
  {
    className: 'ridge-far',
    rise: 60,
    fill: 'var(--ridge-2)',
    blur: 2,
    d: 'M0,294 C211,294 211,221 421,221 C598,221 598,295 775,295 C1002,295 1002,213 1230,213 C1365,213 1365,289 1500,289 L1500,460 L0,460 Z',
  },
  {
    className: 'ridge-mid',
    rise: 48,
    fill: 'var(--ridge-3)',
    blur: 1,
    d: 'M0,337 C149,337 149,282 298,282 C404,282 404,345 511,345 C601,345 601,306 691,306 C778,306 778,346 866,346 C1011,346 1011,278 1157,278 C1323,278 1323,342 1489,342 L1500,460 L0,460 Z',
  },
  {
    className: 'ridge-mid',
    rise: 42,
    fill: 'var(--ridge-4)',
    blur: 0,
    d: 'M0,392 q16,-24 33,3 q17,-16 35,-2 q17,-25 35,5 q12,-13 24,3 q14,-14 28,-3 q18,-11 36,5 q15,-24 31,5 q12,-10 24,4 q10,-11 21,-4 q12,-17 25,5 q9,-24 19,1 q16,-16 33,4 q13,-19 26,3 q9,-12 19,3 q13,-23 27,4 q10,-18 21,1 q13,-26 26,0 q9,-12 19,5 q11,-22 22,-3 q14,-22 28,-3 q9,-10 19,-1 q12,-11 25,3 q15,-22 31,2 q10,-16 21,0 q14,-12 29,0 q14,-10 29,2 q11,-14 22,-1 q11,-10 22,-4 q16,-25 33,-2 q18,-16 36,3 q17,-16 35,-2 q16,-22 32,-3 q15,-23 31,-1 q9,-18 19,5 q14,-10 28,-1 q12,-22 24,5 q18,-13 37,-4 q11,-16 23,3 q13,-10 27,5 q14,-19 29,2 q10,-12 21,-3 q12,-17 25,-4 q15,-21 30,5 q16,-14 33,5 q17,-14 34,2 q12,-14 24,0 q13,-17 26,-1 q12,-16 24,2 q17,-12 34,2 q10,-13 20,-3 q10,-26 20,0 q13,-22 26,0 q16,-25 32,0 q17,-15 35,-3 L1500,460 L0,460 Z',
  },
  {
    className: 'ridge-near',
    rise: 36,
    fill: 'var(--ridge-5)',
    blur: 0,
    d: 'M0,428 q18,-15 36,-4 q22,-22 45,2 q19,-29 39,1 q15,-19 31,0 q20,-13 41,-1 q20,-13 41,-3 q14,-28 29,2 q13,-29 27,2 q19,-14 38,-1 q14,-31 28,1 q16,-32 32,-1 q19,-31 38,1 q22,-22 45,1 q22,-15 45,3 q16,-28 32,5 q20,-34 41,-2 q16,-18 32,4 q18,-34 37,4 q16,-31 33,-3 q14,-16 29,2 q14,-31 28,0 q22,-21 45,5 q18,-16 37,1 q18,-30 36,0 q20,-30 41,-1 q17,-17 35,-3 q15,-28 30,-1 q18,-30 37,-2 q22,-16 45,2 q16,-27 32,-4 q14,-33 28,2 q19,-13 39,-2 q17,-34 34,-4 q17,-14 34,4 q20,-15 41,1 q13,-25 27,3 q16,-14 33,-3 q17,-27 35,4 q16,-27 33,0 q16,-15 33,-3 q22,-29 44,-2 L1500,460 L0,460 Z',
  },
];

export function HeroRidges() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1500 460"
      preserveAspectRatio="none"
      className="ridges pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[min(76vh,620px)] w-full"
    >
      <defs>
        {/* Grain. A perfectly flat fill is what makes vector scenery read as clip art. */}
        <filter id="hero-grain" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" result="noise" />
          <feColorMatrix in="noise" type="saturate" values="0" />
        </filter>
      </defs>

      {ridges.map((ridge, i) => (
        <g key={i} className={ridge.className}>
          <path
            className="ridge-in"
            style={{ '--ridge-rise': `${ridge.rise}px` } as CSSProperties}
            d={ridge.d}
            fill={ridge.fill}
            filter={ridge.blur ? `blur(${ridge.blur}px)` : undefined}
          />
        </g>
      ))}

      <rect width="100%" height="100%" filter="url(#hero-grain)" opacity="0.07" />
    </svg>
  );
}
