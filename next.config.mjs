import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

// This directory is the whole project, and it is mounted into the axonpack monorepo as a submodule
// at `landing-page/`. Pinning Turbopack's root here stops it inferring one from a lockfile further up
// when it is checked out inside that monorepo.
const projectRoot = import.meta.dirname;

// No basePath. This repo is named axonpack.github.io, so Pages serves it as the organisation root
// site and the app owns "/" directly. The docs live under a real /docs route segment instead of
// borrowing one from the prefix.
/** @type {import('next').NextConfig} */
const config = {
  output: 'export',
  // Pages resolves `/foo/` to `/foo/index.html`. Without this, export writes `foo.html`, which works
  // on Pages but breaks any host that doesn't guess the extension.
  trailingSlash: true,
  // There is no server to optimise images on.
  images: { unoptimized: true },
  reactStrictMode: true,
  turbopack: { root: projectRoot },
  outputFileTracingRoot: projectRoot,
};

export default withMDX(config);
