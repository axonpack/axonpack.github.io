import type { Metadata } from 'next';
import Link from 'next/link';
import { getReleases } from '@/lib/services/blog-entries.service';
import { formatDate } from '@/lib/utils/format-date.util';
import { inlineMd } from '@/lib/utils/inline-md.util';
import { BUMP_STYLES } from '@/lib/constants/bump-styles.const';

export const metadata: Metadata = {
  title: 'Changelog',
  description: 'Every release of every Axonpack library, taken from the changelog each one publishes to npm.',
};

export default function ChangelogPage() {
  const releases = getReleases();
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-5 py-20">
      <h1 className="text-[clamp(2rem,1.4rem+2vw,3rem)] leading-tight font-[640] tracking-[-0.03em]">Changelog</h1>
      <p className="mt-4 text-fd-muted-foreground text-pretty">
        Every release of every library. Nobody writes these entries. Each one is the changelog the
        package published to npm, so what shipped and what you read here cannot drift apart.
      </p>
      <ol className="mt-12 space-y-4">
        {releases.map((release) => (
          <li key={release.anchor} id={release.anchor} className="scroll-mt-20 rounded-lg border bg-fd-card p-6">
            <div className="flex flex-wrap items-center gap-2">
              <Link href={release.href} className="font-mono text-sm font-semibold hover:text-fd-primary">
                {release.library}
              </Link>
              <span className="rounded-full border bg-fd-secondary px-2 py-0.5 font-mono text-[0.7rem] text-fd-muted-foreground">
                v{release.version}
              </span>
              {release.bump && (
                <span className={`rounded-full border px-2 py-0.5 text-[0.7rem] font-medium ${BUMP_STYLES[release.bump] ?? BUMP_STYLES.patch}`}>
                  {release.bump}
                </span>
              )}
              <time dateTime={release.date.toISOString()} className="ms-auto text-xs text-fd-muted-foreground">
                {formatDate(release.date)}
              </time>
            </div>
            {release.items.length > 0 && (
              <ul className="mt-4 space-y-2">
                {release.items.map((item, i) => (
                  <li key={i} className="flex gap-2.5 text-sm text-fd-muted-foreground">
                    <span className="mt-1.5 size-1 shrink-0 rounded-full bg-fd-primary" />
                    <span dangerouslySetInnerHTML={{ __html: inlineMd(item) }} />
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ol>
    </main>
  );
}
