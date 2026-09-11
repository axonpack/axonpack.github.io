/**
 * Two names, deliberately. `appName` is what appears in chrome where space is tight and the reader
 * already knows where they are — the nav, a browser tab suffix. `appLongName` is the full name, used
 * where the site introduces itself to someone who has not seen it before: a shared link's title, an
 * OG card, a search result.
 */
export const appName = 'Axonpack';
export const appLongName = 'Axonpack Open Source';
export const appTagline = 'Free, open source tools and libraries for React and React Native.';

// The docs sit under their own segment now. This app serves the organisation root, so `/` is the
// landing page and the docs tree hangs off /docs. Fumadocs builds every page URL from this.
export const docsRoute = '/docs';
export const docsImageRoute = '/og/docs';
export const docsContentRoute = '/llms.mdx/docs';

/** The project. Used for the nav link, which is about Axonpack as a whole. */
export const gitConfig = {
  user: 'axonpack',
  repo: 'axonpack',
  branch: 'main',
};

/**
 * The repository these pages live in, which is this one. Kept separate from `gitConfig` because a
 * page's "open in GitHub" link has to resolve to the file, and the file is not in the monorepo.
 */
export const docsRepo = {
  user: 'axonpack',
  repo: 'axonpack.github.io',
  branch: 'main',
};

export const pageSourceUrl = (path: string) =>
  `https://github.com/${docsRepo.user}/${docsRepo.repo}/blob/${docsRepo.branch}/content/docs/${path}`;
