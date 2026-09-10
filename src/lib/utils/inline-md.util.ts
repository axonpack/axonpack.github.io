// Changelog bullets use a little inline markdown: bold, code spans, the occasional link. That is
// not worth a markdown dependency, so it is four rules applied in one pass over escaped text.
// Escaping first is what makes this safe; the single pass is what stops a replacement being
// re-matched by a later rule.
const escape = (text: string) =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export const inlineMd = (text: string) =>
  escape(text).replace(
    /\[([^\]]+)\]\((https?:[^)]+)\)|`([^`]+)`|\*\*([^*]+)\*\*|\*([^*]+)\*/g,
    (_match, linkText, href, code, bold, italic) => {
      if (href)
        return `<a href="${href}" target="_blank" rel="noreferrer noopener" class="text-accent underline underline-offset-2">${linkText}</a>`;
      if (code)
        return `<code class="rounded bg-secondary px-1 py-0.5 font-mono text-[0.85em]">${code}</code>`;
      if (bold) return `<strong class="font-semibold text-foreground">${bold}</strong>`;
      return `<em>${italic}</em>`;
    },
  );
