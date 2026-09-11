import Link from 'next/link';
import { InstallChip } from '@/components/copy-button';
import { DevtoolsPanel } from '@/components/devtools-panel';
import { HeroStage } from '@/components/hero-stage';
import { content } from '@/lib/services/content.service';

// The accent half of the headline is the tail, so the words carry on counting rather than restarting.
const words = [
  ...content.hero.title.split(' ').map((word) => ({ word, accent: false })),
  ...content.hero.titleAccent.split(' ').map((word) => ({ word, accent: true })),
];

export function Hero() {
  return (
    <header className="hero-band relative overflow-hidden px-6 pt-28 pb-0 sm:pt-40">
      <HeroStage>
        <div className="mx-auto flex max-w-[1080px] flex-col items-center">
          <p className="rise inline-flex items-center gap-2 rounded-full border bg-fd-card/70 px-4 py-1 text-[0.875rem] text-fd-muted-foreground">
            <span className="size-1.5 rounded-full bg-fd-primary" />
            {content.hero.eyebrow}
          </p>

          <h1 className="mt-6 max-w-[620px] text-center text-[clamp(2.25rem,1.1rem+3.6vw,3.5rem)] leading-[1.3] font-normal tracking-[-0.04em] text-balance">
            {words.map(({ word, accent }, i) => (
              <span
                key={`${word}-${i}`}
                className={`rise mr-[0.25em] inline-block ${accent ? 'text-fd-primary' : ''}`}
                style={{ animationDelay: `${100 + i * 40}ms` }}
              >
                {word}
              </span>
            ))}
          </h1>

          <p className="rise mt-4 max-w-[420px] text-center text-[0.875rem] leading-[1.5] tracking-[-0.02em] text-fd-muted-foreground text-pretty [animation-delay:200ms]">
            {content.hero.lead}
          </p>

          <div className="rise mt-12 [animation-delay:300ms]">
            <Link
              href="/docs/"
              className="inline-flex h-12 items-center justify-center rounded-full bg-fd-primary px-9 text-[0.875rem] font-medium text-fd-primary-foreground transition-transform hover:-translate-y-px"
            >
              Read the docs
            </Link>
          </div>

          <div className="rise [animation-delay:380ms]">
            <InstallChip command={content.hero.install} />
          </div>
        </div>

        <div className="rise mx-auto mt-20 -mb-32 max-w-[960px] [animation-delay:460ms]">
          <div className="tilt">
            <DevtoolsPanel />
          </div>
        </div>
      </HeroStage>
      <div className="hairline" />
    </header>
  );
}
