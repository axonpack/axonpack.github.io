// Semver bump badge colours. Kept with the other tokens so the changelog page and the header
// panel cannot colour the same bump differently.
export const BUMP_STYLES: Record<string, string> = {
  major: "border-transparent bg-rose-500/15 text-rose-500",
  minor: "border-transparent bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  patch: "border-border bg-secondary text-subtle",
};
