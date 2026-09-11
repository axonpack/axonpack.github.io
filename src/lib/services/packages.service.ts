import data from "@/generated/packages.json";

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
  version: string;
  description: string;
  keywords: string[];
  license: string | null;
  weeklyDownloads: number | null;
  publishedAt: string | null;
  releases: Release[];
  docsHref: string;
  npmHref: string;
  /** Whether content/docs/<slug>/ exists. A published package need not be a documented one. */
  hasDocs: boolean;
  hasChangelog: boolean;
};

export const packages: Package[] = data.packages;

/** Only these can be linked into the docs site without 404ing. */
export const documented: Package[] = data.packages.filter((pkg) => pkg.hasChangelog);
export const builtAt: string = data.builtAt;

/** "@axonpack/expo-devtools" -> "expo-devtools" */
export const shortName = (name: string) => name.replace(/^@axonpack\//, "");
