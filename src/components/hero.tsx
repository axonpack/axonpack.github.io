import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { InstallChip } from '@/components/copy-button';
import { HeroPanel } from '@/components/hero-panel';
import { HeroStage } from '@/components/hero-stage';
import { content } from '@/lib/services/content.service';
import { packages } from '@/lib/services/packages.service';
import { getReleases } from '@/lib/services/blog-entries.service';

const compact = (n: number) =>
  n >= 1000 ? `${(n / 1000).toFixed(1).replace(/\.0$/, '')}K` : `${n}`;

// The accent half of the headline is the tail, so the words carry on counting rather than restarting.
const words = [
  ...content.hero.title.split(' ').map((word) => ({ word, accent: false })),
  ...content.hero.titleAccent.split(' ').map((word) => ({ word, accent: true })),
];

export function Hero() {
  const weekly = packages.reduce((sum, pkg) => sum + (pkg.weeklyDownloads ?? 0), 0);
  const releaseCount = getReleases().length;

  // Every figure comes from npm, so the line cannot contradict the catalogue below it.
  const stats = [
    { value: `${packages.length}`, label: packages.length === 1 ? 'library' : 'libraries' },
    { value: compact(weekly), label: 'downloads a week' },
    { value: `${releaseCount}`, label: releaseCount === 1 ? 'release' : 'releases' },
    { value: 'MIT', label: 'no tiers' },
  ];

  return (
    <header className="px-5 pt-20 pb-20 sm:pt-28">
      <HeroStage>
        <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[minmax(0,1fr)_auto]">
          <div className="text-center lg:text-left">
            <h1 className="text-[clamp(2.5rem,1.1rem+5.2vw,4.25rem)] leading-[1.03] font-[640] tracking-[-0.04em] text-balance">
              {words.map(({ word, accent }, i) => (
                <span
                  key={`${word}-${i}`}
                  className={`rise mr-[0.25em] inline-block ${accent ? 'text-fd-primary' : ''}`}
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  {word}
                </span>
              ))}
            </h1>

            <p className="rise mx-auto mt-6 max-w-xl text-lg text-fd-muted-foreground text-pretty lg:mx-0 [animation-delay:420ms]">
              {content.hero.lead}
            </p>

            <div className="rise mt-9 flex flex-wrap justify-center gap-3 max-sm:flex-col lg:justify-start [animation-delay:500ms]">
              <Link
                href="/docs/"
                className="group inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-fd-primary px-5 text-sm font-medium text-fd-primary-foreground transition-transform hover:-translate-y-px"
              >
                Read the docs
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <a
                href={content.hero.actions[1].href}
                target="_blank"
                rel="noreferrer noopener"
                className="group inline-flex h-11 items-center justify-center gap-2 rounded-lg border bg-fd-card px-5 text-sm font-medium transition-colors hover:border-fd-primary"
              >
                {content.hero.actions[1].label}
                <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5" />
              </a>
            </div>

            <div className="rise [animation-delay:580ms]">
              <InstallChip command={content.hero.install} />
            </div>

            <p className="rise mt-8 flex flex-wrap justify-center gap-x-5 gap-y-1 text-[0.8125rem] text-fd-muted-foreground lg:justify-start [animation-delay:660ms]">
              {stats.map((stat) => (
                <span key={stat.label}>
                  <b className="font-[620] text-fd-foreground">{stat.value}</b> {stat.label}
                </span>
              ))}
            </p>
          </div>

          <div className="rise justify-self-center [animation-delay:200ms]">
            <div className="tilt">
              <div className="drift">
                <HeroPanel />
              </div>
            </div>
          </div>
        </div>
      </HeroStage>
    </header>
  );
}
