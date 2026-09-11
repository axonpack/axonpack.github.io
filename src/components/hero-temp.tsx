/**
 * Scratch hero, rebuilt step by step. Fixed height so the space below it never moves while we work,
 * and the page's own background so it reads as one surface with the header above it. `hero.tsx` is
 * untouched and still on disk.
 */
export function HeroTemp() {
  return <section className="h-[520px] w-full bg-fd-background sm:h-[680px] lg:h-[760px]" />;
}
