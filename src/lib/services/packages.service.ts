import data from '@/generated/packages.json';

/** One "## <version>" section of a library's Changesets CHANGELOG.md. */
export type Release = {
  version: string;
  /** From the "### Patch|Minor|Major Changes" heading, absent if the section had none. */
  bump: string | null;
  /** npm publish time for this version, joined on at build time. Null if npm had no record. */
  date: string | null;
  items: string[];
};

export type Package = {
  name: string;
  slug: string;
  /** Human label, e.g. `Expo Devtools`. Derived from the slug. */
  title: string;
  version: string;
  description: string;
  keywords: string[];
  license: string | null;
  /** Every download since first publish, summed across npm's 18-month range limit. */
  totalDownloads: number | null;
  publishedAt: string | null;
  releases: Release[];
  docsHref: string;
  npmHref: string;
  /** Whether content/docs/<slug>/ exists. A published package need not be a documented one. */
  hasDocs: boolean;
  hasChangelog: boolean;
};

/**
 * `expo-devtools` becomes `Expo Devtools`. Derived from the slug rather than carried as a field,
 * because a second hand-written name is a second thing to keep in step with the first.
 *
 * This is the label, not the identity. The npm name stays wherever the npm name is the point: the
 * install command, the npm link, and the title of the package's own docs.
 */
export const title = (slug: string) =>
  slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

export const packages: Package[] = data.packages.map((pkg) => ({ ...pkg, title: title(pkg.slug) }));

/** Only these can be linked into the docs site without 404ing. */
export const documented: Package[] = packages.filter((pkg) => pkg.hasChangelog);
export const builtAt: string = data.builtAt;

/** "@axonpack/expo-devtools" -> "expo-devtools" */
export const shortName = (name: string) => name.replace(/^@axonpack\//, '');
