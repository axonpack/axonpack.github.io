/**
 * Rebuilds each package's `content/docs/<slug>/changelog.mdx` from its own CHANGELOG.md.
 *
 * The changelogs are written by Changesets in the monorepo, and this site is a different repository —
 * so the pages here are generated and committed rather than fetched at build time. A build that has
 * to reach GitHub to render a page fails whenever GitHub does, and a release only happens a few
 * times a month, which is exactly the cadence a manual `bun run sync:changelog` suits.
 *
 * Release dates come from the npm registry: Changesets does not record them, and the git tags that
 * would carry them are not reliably pushed.
 *
 * Usage: bun run sync:changelog
 */
import { readFile, writeFile } from 'node:fs/promises';

/**
 * Every package with a changelog page. A package earns an entry here on the day it goes to npm, the
 * same rule the rest of the site follows. The slug is the docs folder, which is the npm name without
 * the scope, exactly as `packages.service` derives it.
 */
const PACKAGES = [
  { name: '@axonpack/expo-devtools', slug: 'expo-devtools' },
  { name: '@axonpack/react-pretty-print', slug: 'react-pretty-print' },
];

const OUT_DATA = new URL('../src/lib/releases.generated.ts', import.meta.url);

const get = async (url, as = 'text') => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} — ${url}`);
  return as === 'json' ? res.json() : res.text();
};

/**
 * This repository is mounted as a submodule at `docs/` inside the monorepo, so when you are working
 * there the package's changelog is on disk one level up. Read that first: it means a version bumped
 * locally shows on the site immediately, without waiting for the change to reach `main`.
 */
async function readChangelog(name) {
  try {
    const local = await readFile(
      new URL(`../../packages/${name}/CHANGELOG.md`, import.meta.url),
      'utf8',
    );
    console.log(`${name}: ../packages (local checkout)`);
    return local;
  } catch {
    console.log(`${name}: raw.githubusercontent.com (main)`);
    return get(`https://raw.githubusercontent.com/axonpack/axonpack/main/packages/${name}/CHANGELOG.md`);
  }
}

/**
 * Only the release dates and the current version come from npm. Losing them costs a date on each
 * heading, which is not worth failing a local run over — offline, the page still regenerates.
 */
async function readRegistry(name) {
  try {
    return await get(`https://registry.npmjs.org/${name}`, 'json');
  } catch (error) {
    console.warn(`${name}: npm registry unavailable (${error.message}) — dates omitted`);
    return null;
  }
}

/**
 * Changesets emits `- <sha>: <text>` with any further bullets indented under it, and plain
 * `- <text>` when the changeset carried no sha. A changeset whose body is itself a list comes out
 * of the second shape as `- - <text>`, which renders as an empty bullet wrapping the real one.
 */
const stripCommitPrefix = (line) =>
  line.replace(/^- [0-9a-f]{7,40}: (?:- )?/, '- ').replace(/^- - /, '- ');
const dedent = (line) => (line.startsWith('  - ') ? line.slice(2) : line);

function parse(markdown) {
  const releases = [];
  let current = null;
  for (const raw of markdown.split('\n')) {
    const version = raw.match(/^## (\d+\.\d+\.\d+.*)$/);
    if (version) {
      current = { version: version[1].trim(), sections: [] };
      releases.push(current);
      continue;
    }
    if (!current) continue; // the file's own H1
    const section = raw.match(/^### (Major|Minor|Patch) Changes$/);
    if (section) {
      current.sections.push({ bump: section[1], lines: [] });
      continue;
    }
    const open = current.sections.at(-1);
    if (open) open.lines.push(dedent(stripCommitPrefix(raw)));
  }
  return releases;
}

async function sync({ name, slug }) {
  const [markdown, registry] = await Promise.all([readChangelog(name), readRegistry(name)]);

  // `null` means we could not reach npm, which is not the same as a version being absent from it —
  // saying "not yet published" because the network was down would put a false claim on the page.
  const known = registry !== null;
  const dates = registry?.time ?? {};
  const fmtDate = (v) =>
    dates[v]
      ? new Date(dates[v]).toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })
      : null;

  const releases = parse(markdown);

  const body = releases
    .map((r) => {
      const date = fmtDate(r.version);
      const bumps = r.sections.map((s) => s.bump.toLowerCase());
      // A version can be in CHANGELOG.md before it reaches npm: `changeset version` writes the
      // entry, `changeset publish` does the publishing. Until then there is no date and no page to
      // link to, so say that rather than linking somewhere that 404s.
      const published = Boolean(dates[r.version]);
      // A release can carry more than one kind of change. The badge shows the largest, which is the
      // one that decides the version bump, so it cannot disagree with the number in the heading.
      const rank = { major: 3, minor: 2, patch: 1 };
      const bump = bumps.sort((a, b) => rank[b] - rank[a])[0] ?? null;
      // Three states, not two. `pending` is only truthful when npm answered and did not list the
      // version; when npm was unreachable we know nothing, so neither attribute is written.
      const attrs = [
        published ? `date="${date}"` : known ? 'pending' : '',
        bump ? `bump="${bump}"` : '',
        published ? `npm="https://www.npmjs.com/package/${name}/v/${r.version}"` : '',
      ]
        .filter(Boolean)
        .join(' ');

      // The bump is already on the meta line; repeating it as a heading only adds noise when a
      // release has one kind of change, which nearly all of them do.
      const showHeadings = r.sections.length > 1;
      const sections = r.sections
        .map((s) => {
          const text = s.lines.join('\n').trim();
          return showHeadings ? `### ${s.bump} changes\n\n${text}` : text;
        })
        .join('\n\n');

      return `## ${r.version}\n\n<ReleaseMeta ${attrs} />\n\n${sections}`;
    })
    .join('\n\n');

  const latest = registry?.['dist-tags']?.latest;
  const page = `---
title: Changelog
description: Every published release of ${name}, newest first.
---

{/* Generated by scripts/sync-changelog.mjs from the package's CHANGELOG.md — do not edit by hand. */}

Every published release, newest first.${latest ? ` The current version is **${latest}**.` : ''}

${body}
`;

  await writeFile(new URL(`../content/docs/${slug}/changelog.mdx`, import.meta.url), page);
  console.log(
    `  wrote ${releases.length} releases to content/docs/${slug}/changelog.mdx` +
      (latest ? ` (latest ${latest})` : ''),
  );

  return { slug, latest, date: latest ? fmtDate(latest) : null };
}

const results = await Promise.all(PACKAGES.map(sync));

// The pages that advertise a current version read it from here, so a badge cannot drift from the
// changelog it links to — both come out of the same sync. A package npm could not answer for is left
// out rather than written with a hole in it, and the file is only rewritten if at least one answered:
// without that, a run made offline would wipe every version the site knows.
const found = results.filter((r) => r.latest);
if (found.length === 0) {
  console.warn('no versions from npm — leaving releases.generated.ts untouched');
} else {
  if (found.length < results.length) {
    const missing = results.filter((r) => !r.latest).map((r) => r.slug);
    console.warn(`no version from npm for ${missing.join(', ')} — omitted from releases.generated.ts`);
  }
  await writeFile(
    OUT_DATA,
    `// Generated by scripts/sync-changelog.mjs — do not edit by hand.
export const releases: Record<string, { version: string; date: string }> = {
${found.map((r) => `  '${r.slug}': { version: '${r.latest}', date: '${r.date}' },`).join('\n')}
};
`,
  );
}
