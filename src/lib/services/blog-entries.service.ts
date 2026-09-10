import { getCollection } from "astro:content";
import { packages } from "@/lib/services/packages.service";

// Two separate streams, deliberately. Posts are written by hand and there are none yet. Releases
// are each library's CHANGELOG.md, parsed at build time and dated from npm's publish times, so
// they exist from the moment a library ships.

export type Post = {
  date: Date;
  title: string;
  description: string;
  href: string;
  author: string;
};

export type ReleaseEntry = {
  date: Date;
  library: string;
  version: string;
  bump: string | null;
  items: string[];
  /** The library's docs, for readers who want the feature rather than the note. */
  href: string;
  anchor: string;
};

export const getPosts = async (): Promise<Post[]> => {
  const posts = await getCollection("blog", ({ data }) => !data.draft);
  return posts
    .map((post) => ({
      date: post.data.date,
      title: post.data.title,
      description: post.data.description,
      author: post.data.author,
      href: `/blog/${post.id}/`,
    }))
    .sort((a, b) => b.date.getTime() - a.date.getTime());
};

// Synchronous: releases come from the generated package data, not from a content collection.
export const getReleases = (): ReleaseEntry[] =>
  packages
    .flatMap((pkg) =>
      pkg.releases
        .filter((release) => release.date)
        .map((release) => ({
          date: new Date(release.date!),
          library: pkg.slug,
          version: release.version,
          bump: release.bump,
          items: release.items,
          href: pkg.docsHref,
          anchor: `${pkg.slug}-${release.version.replace(/\./g, "-")}`,
        })),
    )
    .sort((a, b) => b.date.getTime() - a.date.getTime());
