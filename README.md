# axonpack.github.io

The landing page at [axonpack.github.io](https://axonpack.github.io) — one static HTML file, one
image and a set of inline SVG icons. Mounted into the
[axonpack monorepo](https://github.com/axonpack/axonpack) as a submodule at `landing-page/`.

**This page is about the project, not about any one package.** Product detail — what a tab does, how
to call an API — belongs in that package's documentation under `/docs`. What belongs here is what is
true of Axonpack as a whole: what it is, how the packages are built, and how to take part.

**Neither live site carries a roadmap.** Only published packages appear here or in the docs; work
that has not shipped stays in the monorepo's `notes/plan.md`. Naming a library on a public page is a
promise, and there is nothing behind it until it is on npm.

## Why this repo exists at all

GitHub serves the organisation root **only** from a repository named exactly `<org>.github.io`. That
is the whole job of this one. The documentation is a separate project site served by
[`axonpack/docs`](https://github.com/axonpack/docs) at `/docs`, and the two coexist because GitHub
routes `/<repo>` to the matching project site.

**Do not add a `docs/` directory here.** It would shadow the path the documentation is served on.

## Why plain HTML

There is no build step, no dependencies and no workflow — Pages serves this branch directly. A single
page that changes a few times a year does not earn a toolchain, and the absence of one means it cannot
break in CI. If it ever grows sections that need components, that is the moment to reach for a
framework, not before.

The palette mirrors the docs site so the two do not read as different products.

## Editing it

Change `index.html` and push. Pages redeploys on its own.

Settings → Pages → Source: **Deploy from a branch**, `main` / `(root)`.
