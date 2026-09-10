# Axonpack

**The open source tools and libraries for React and React Native.**

Small, focused, dependency-light packages. Drop one in and carry on. There is no framework here
to adopt.

Live at [axonpack.github.io](https://axonpack.github.io). Docs at
[axonpack.github.io/docs](https://axonpack.github.io/docs).

## Published

| Library                                                                      | Version                                                                | What it does                                                     |
| ---------------------------------------------------------------------------- | ---------------------------------------------------------------------- | ---------------------------------------------------------------- |
| [`@axonpack/expo-devtools`](https://axonpack.github.io/docs/expo-devtools)    | ![npm](https://img.shields.io/npm/v/@axonpack/expo-devtools?label=)    | Browser-style devtools that run inside your app, on the device    |
| [`@axonpack/react-pretty-print`](https://www.npmjs.com/package/@axonpack/react-pretty-print) | ![npm](https://img.shields.io/npm/v/@axonpack/react-pretty-print?label=) | Collapsible JSON and XML trees, plus a syntax highlighter |

```sh
npx expo install @axonpack/expo-devtools
```

Everything is MIT licensed. There are no tiers and nothing is paid.

## How the libraries are built

- **Small and focused.** One package solves one problem. Nothing here grows into a framework that
  wants to own your app's structure.
- **Dependency-light.** Adding a package should not add a supply chain. Where a package needs a
  library you may already have, you hand yours over instead of having a second copy installed.
- **Independently published.** Each one versions and ships on its own, with its own docs.
  Installing one never drags in another.
- **Honest about limits.** Every guide ends with what the thing cannot do, and why. A number that
  cannot be measured is left out rather than invented.

## Only shipped work appears here

Neither this site nor the docs carries a roadmap. A library shows up on the day it goes to npm and
not before. Work that has not shipped stays in the monorepo's `notes/plan.md`.

Naming a library on a public page is a promise, and there is nothing behind it until you can
install it.

## Why this repo exists

GitHub serves an organisation's root site **only** from a repository named exactly
`<org>.github.io`. That is this repo's whole job.

The docs are a separate project site, built from [`axonpack/docs`](https://github.com/axonpack/docs)
and served at `/docs`. The two coexist because GitHub routes `/<repo>` to the matching project site.

**Do not add a `docs/` directory here.** It would shadow the path the docs are served on.

## Running it locally

```sh
bun install
bun run dev        # fetches the catalogue from npm, then starts Astro
bun run build      # writes dist/
bun run typecheck  # astro check
```

Astro with `output: "static"` and Tailwind v4. There is no adapter and no SSR, because GitHub Pages cannot run a server. The pages ship no external
JavaScript: the header menus, theme toggle and copy button are small inline scripts.

## The library list is not written by hand

`scripts/fetch-packages.mjs` runs before every build and asks npm what exists. Publish a package
and the next build puts it in the nav, the library grid, the footer and the stats. Unpublish one and
it disappears. Nothing to edit.

It reads two npm sources, because neither is enough on its own:

- the search endpoint carries descriptions and keywords, but its index lags a fresh publish
- the org listing is immediate, but lists packages outside the scope, so it gets filtered

Docs links are derived too. `@axonpack/x` becomes `/docs/x/`, so a new library needs no routing
entry anywhere.

Release notes work the same way. Each library's `CHANGELOG.md` is read from its published npm
tarball, parsed into entries, and dated from npm's publish times. Those become the blog. A changeset
that ships turns into a blog entry with nothing to copy across.

GitHub is not used for any of this. Every source is a public npm endpoint, so the build needs no
credentials.

## Editing the words

Prose lives in `src/content.json`. Change it there, not in the markup. Anything about the libraries
themselves comes from npm and is not editable here.

Blog posts are markdown files in `src/content/blog/`. Releases are generated, so you never write
those.

## How it deploys

`.github/workflows/deploy.yml` builds and publishes on push to `main`, and again on a daily cron so
versions and download counts stay current without a commit.

This needs **Settings → Pages → Source: GitHub Actions**. On the older "Deploy from a branch"
setting the workflow runs but publishes nothing.

## Layout

```
src/
  components/          one component per file
    ui/                atomic primitives
  layouts/
  lib/
    constants/         tokens and path data
    services/          shape the generated and static data
    utils/             pure helpers
  pages/               routes
  content.json         all the prose
  generated/           written by the fetch script, never committed
scripts/
  fetch-packages.mjs   asks npm what exists
legacy/                the previous no-build page, kept until Pages is switched over
```

File names are kebab-case with a role suffix, matching the monorepo's `CONVENTIONS.md`.

## Product detail belongs in the docs

This page is about the project, not about any one library. What a tab does, how to call an API, what
an option means: that goes in the library's own docs. What belongs here is what is true of Axonpack
as a whole.

The palette matches the docs site on purpose, so the two do not read as different products.
