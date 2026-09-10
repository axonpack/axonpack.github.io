import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { InstallChip } from '@/components/copy-button';
import { content } from '@/lib/services/content.service';
import { packages } from '@/lib/services/packages.service';
import { getReleases } from '@/lib/services/blog-entries.service';

const compact = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(1).replace(/\.0$/, '')}K` : `${n}`);

export function Hero() {
  const weekly = packages.reduce((sum, pkg) => sum + (pkg.weeklyDownloads ?? 0), 0);
  const releaseCount = getReleases().length;

  // Every figure comes from npm, so the strip cannot contradict the catalogue below it.
  const stats = [
    { value: `${packages.length}`, label: packages.length === 1 ? 'library published' : 'libraries published' },
    { value: compact(weekly), label: 'downloads a week' },
    { value: `${releaseCount}`, label: releaseCount === 1 ? 'release shipped' : 'releases shipped' },
    { value: 'MIT', label: 'licensed, no tiers' },
  ];

  return (
    <header className="px-5 pt-20 pb-16 text-center sm:pt-28">
      <div className="mx-auto max-w-3xl">
        <p className="inline-flex items-center gap-2 rounded-full border bg-fd-card px-3 py-1.5 text-[0.8125rem] text-fd-muted-foreground">
          <span className="size-1.5 rounded-full bg-fd-primary" />
          {content.hero.eyebrow}
        </p>
        <h1 className="mt-7 text-[clamp(2.5rem,1.1rem+5.2vw,4.25rem)] leading-[1.03] font-[640] tracking-[-0.04em] text-balance">
          {content.hero.title} <span className="text-fd-primary">{content.hero.titleAccent}</span>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-fd-muted-foreground text-pretty">
          {content.hero.lead}
        </p>

        <div className="mt-9 flex flex-wrap justify-center gap-3 max-sm:flex-col">
          <Link
            href="/docs/"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-fd-primary px-5 text-sm font-medium text-fd-primary-foreground transition-all hover:-translate-y-px"
          >
            Read the docs <ArrowRight className="size-4" />
          </Link>
          <a
            href={content.hero.actions[1].href}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border bg-fd-card px-5 text-sm font-medium transition-colors hover:border-fd-primary"
          >
            {content.hero.actions[1].label} <ArrowUpRight className="size-4" />
          </a>
        </div>

        <InstallChip command={content.hero.install} />

        <ul className="mt-14 grid grid-cols-2 overflow-hidden rounded-lg border bg-fd-card sm:grid-cols-4">
          {stats.map((stat, i) => (
            <li
              key={stat.label}
              className={`px-4 py-6 ${i > 0 ? 'sm:border-l' : ''} ${i % 2 === 1 ? 'border-l' : ''} ${i >= 2 ? 'border-t sm:border-t-0' : ''}`}
            >
              <b className="block text-3xl leading-tight font-[620] tracking-tight">{stat.value}</b>
              <span className="mt-1 block text-[0.8125rem] text-fd-muted-foreground">{stat.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
