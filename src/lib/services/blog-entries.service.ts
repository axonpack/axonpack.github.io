import { getCollection } from "astro:content";
import { packages } from "@/lib/services/packages.service";

// Both the blog page and the header's Blog panel need this list. Built in one place so the two
// cannot disagree about what the latest entry is.

export type Entry =
  | { kind: "post"; date: Date; title: string; description: string; href: string; author: string }
  | {
      kind: "release";
      date: Date;
      library: string;
      version: string;
      bump: string | null;
      items: string[];
      href: string;
      anchor: string;
    };

export const getEntries = async (): Promise<Entry[]> => {
  const posts = await getCollection("blog", ({ data }) => !data.draft);

  // Releases are not written by hand. They are each library's CHANGELOG.md, parsed at build time
  // and dated from npm's publish times.
  const releases: Entry[] = packages.flatMap((pkg) =>
    pkg.releases
      .filter((release) => release.date)
      .map((release) => ({
        kind: "release" as const,
        date: new Date(release.date!),
        library: pkg.slug,
        version: release.version,
        bump: release.bump,
        items: release.items,
        href: pkg.docsHref,
        anchor: `${pkg.slug}-${release.version.replace(/\./g, "-")}`,
      })),
  );

  return [
    ...posts.map((post) => ({
      kind: "post" as const,
      date: post.data.date,
      title: post.data.title,
      description: post.data.description,
      author: post.data.author,
      href: `/blog/${post.id}/`,
    })),
    ...releases,
  ].sort((a, b) => b.date.getTime() - a.date.getTime());
};
