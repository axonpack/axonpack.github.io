# axonpack.github.io

The landing page at [axonpack.github.io](https://axonpack.github.io) — one static HTML file and four
images. Mounted into the [axonpack monorepo](https://github.com/axonpack/axonpack) as a submodule at
`landing-page/`.

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
