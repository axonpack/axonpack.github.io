// Discovers every published @axonpack package from npm and writes src/generated/packages.json.
//
// Nothing here is hand-listed: publish a package and the next build picks it up; unpublish one and
// it disappears. That also enforces the repo rule that only shipped packages appear on the site,
// because npm is the only source consulted.
//
// Two sources are unioned on purpose:
//   * search?text=@axonpack  — carries description/keywords/date, but its index lags a fresh publish
//   * /-/org/axonpack/package — immediate, but lists everything the account can write, so it needs
//                               filtering to the scope
// GitHub's contents API is deliberately NOT used: it reflects the default branch, so a package
// merged but unpublished would appear, and one published from a branch would not.
//
// No dependencies — Node 20+ has fetch.

import { mkdir, writeFile } from "node:fs/promises";

const SCOPE = "@axonpack/";
const REPO = "axonpack/axonpack";
const token = process.env.GITHUB_TOKEN;

const json = async (url, init) => {
  const res = await fetch(url, init);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${url}`);
  return res.json();
};
const encode = (name) => name.replace("/", "%2f");

const names = new Set();

try {
  const found = await json("https://registry.npmjs.org/-/v1/search?text=%40axonpack&size=250");
  for (const { package: p } of found.objects) if (p.name.startsWith(SCOPE)) names.add(p.name);
  console.log(`  search:   ${names.size} in scope (of ${found.total})`);
} catch (error) {
  console.warn(`! search failed: ${error.message}`);
}

try {
  const owned = await json("https://registry.npmjs.org/-/org/axonpack/package");
  const before = names.size;
  for (const name of Object.keys(owned)) if (name.startsWith(SCOPE)) names.add(name);
  console.log(`  org list: +${names.size - before} the search index had not caught up on`);
} catch (error) {
  console.warn(`! org listing failed: ${error.message}`);
}

if (names.size === 0) {
  // Better to fail the build than publish a page whose library grid is silently empty.
  throw new Error("no @axonpack packages found — refusing to build an empty catalogue");
}

const packages = [];
for (const name of [...names].sort()) {
  const manifest = await json(`https://registry.npmjs.org/${encode(name)}/latest`);
  const slug = name.slice(SCOPE.length);

  let weeklyDownloads = null;
  try {
    weeklyDownloads = (
      await json(`https://api.npmjs.org/downloads/point/last-week/${encode(name)}`)
    ).downloads;
  } catch {
    // Downloads are decoration; a brand-new package has no data point yet.
  }

  packages.push({
    name,
    slug,
    version: manifest.version,
    description: manifest.description ?? "",
    keywords: manifest.keywords ?? [],
    license: manifest.license ?? null,
    weeklyDownloads,
    // Flat, derived from the package name — the same shape /docs/expo-devtools/ already uses, so a
    // new package needs no routing entry anywhere.
    docsHref: `/docs/${slug}/`,
    npmHref: `https://www.npmjs.com/package/${name}`,
  });
  console.log(`  ${name} -> v${manifest.version}  /docs/${slug}/`);
}

let stars = null;
try {
  const repo = await json(`https://api.github.com/repos/${REPO}`, {
    headers: { accept: "application/vnd.github+json", ...(token && { authorization: `Bearer ${token}` }) },
  });
  stars = repo.stargazers_count;
} catch (error) {
  console.warn(`! stars unavailable: ${error.message}`);
}

await mkdir(new URL("../src/generated/", import.meta.url), { recursive: true });
await writeFile(
  new URL("../src/generated/packages.json", import.meta.url),
  JSON.stringify({ builtAt: new Date().toISOString(), stars, packages }, null, 2) + "\n",
);
console.log(`wrote src/generated/packages.json (${packages.length} packages, ${stars} stars)`);
