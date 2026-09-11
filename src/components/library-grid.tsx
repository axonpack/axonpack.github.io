import { Card, Cards } from 'fumadocs-ui/components/card';
import { Download } from 'lucide-react';
import { packages } from '@/lib/services/packages.service';

/**
 * Fumadocs' own Card and Cards, the same pair `PackageCards` uses inside MDX, so a library looks
 * the same on the landing page as it does in the docs. The version and download line is the only
 * thing added on top, since those come from npm and the docs list has no notion of them.
 */
export function LibraryGrid() {
  return (
    <section className="border-b px-5 py-24">
      <div className="reveal mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-[clamp(1.75rem,1.3rem+1.6vw,2.5rem)] leading-tight font-[620] tracking-tight text-balance">
            Libraries
          </h2>
          <p className="mt-4 text-fd-muted-foreground text-pretty">
            Every library is released and documented on its own, and this list comes straight from
            npm. If it is here, it is installable today.
          </p>
        </div>
        <Cards className="mt-12">
          {packages.map((pkg) => (
            <Card key={pkg.name} title={pkg.slug} href={pkg.docsHref} description={pkg.description}>
              <div className="flex flex-wrap items-center gap-3 text-xs text-fd-muted-foreground">
                <span className="rounded-full border bg-fd-secondary px-2 py-0.5 font-mono text-[0.7rem]">
                  v{pkg.version}
                </span>
                {pkg.weeklyDownloads !== null && (
                  <span className="inline-flex items-center gap-1">
                    <Download className="size-3" />
                    {pkg.weeklyDownloads.toLocaleString()}/wk
                  </span>
                )}
                {pkg.license && <span>{pkg.license}</span>}
              </div>
            </Card>
          ))}
        </Cards>
      </div>
    </section>
  );
}
