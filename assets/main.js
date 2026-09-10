// Copy lives in assets/content.json so the page's words can change without touching markup.
// ponytail: JSON import attributes need Chrome 123+ / Safari 17.2+ / Firefox 139+. Swap for a
// fetch() if an older browser ever has to render this.
import content from "/assets/content.json" with { type: "json" };

// Inline sprite rather than an icon package: this page has no build step, and a handful of glyphs
// is not worth a dependency. It is injected from here instead of sitting in the markup because
// external `<use href="file.svg#id">` still isn't supported everywhere — the symbols have to be in
// the same document.
const ICONS = {
  "arrow-right": '<path d="M5 12h14M13 6l6 6-6 6" />',
  "arrow-up-right": '<path d="M7 17 17 7M8 7h9v9" />',
  box: '<path d="M21 8v8a2 2 0 0 1-1 1.73l-7 4a2 2 0 0 1-2 0l-7-4A2 2 0 0 1 3 16V8a2 2 0 0 1 1-1.73l7-4a2 2 0 0 1 2 0l7 4A2 2 0 0 1 21 8Z" /><path d="m3.3 7 8.7 5 8.7-5M12 22V12" />',
  target:
    '<circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1.5" />',
  feather:
    '<path d="M20.2 3.8a5.5 5.5 0 0 0-7.8 0L4 12.2V20h7.8l8.4-8.4a5.5 5.5 0 0 0 0-7.8ZM16 8 4 20M15 9h-5" />',
  layers: '<path d="m12 2 9 5-9 5-9-5 9-5ZM3 12l9 5 9-5M3 17l9 5 9-5" />',
  eye: '<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" />',
  code: '<path d="m9 18-6-6 6-6M15 6l6 6-6 6" />',
  copy: '<rect x="9" y="9" width="12" height="12" rx="2" /><path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1" />',
  check: '<path d="m4 12.5 5.5 5.5L20 7" />',
  github:
    '<path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.9a3.4 3.4 0 0 0-1-2.6c3.1-.3 6.4-1.5 6.4-7A5.4 5.4 0 0 0 20 4.8a5 5 0 0 0-.1-3.7s-1.2-.4-4 1.5a13.4 13.4 0 0 0-7 0C6.1.7 4.9 1.1 4.9 1.1a5 5 0 0 0-.1 3.7 5.4 5.4 0 0 0-1.4 3.7c0 5.5 3.3 6.7 6.4 7a3.4 3.4 0 0 0-1 2.6V22" />',
  facebook: '<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3V2Z" />',
  youtube: '<rect x="2" y="5" width="20" height="14" rx="4" /><path d="m10 9 5 3-5 3V9Z" />',
};

document.body.insertAdjacentHTML(
  "afterbegin",
  `<svg class="sprite" aria-hidden="true">${Object.entries(ICONS)
    .map(([name, path]) => `<symbol id="i-${name}" viewBox="0 0 24 24">${path}</symbol>`)
    .join("")}</svg>`,
);
const { brand, nav, hero, stats, packages, usage, principles, showcase, footer } = content;

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const icon = (name, cls = "icon") =>
  `<svg class="${cls}" aria-hidden="true"><use href="#i-${name}" /></svg>`;
const ext = (href) =>
  /^https?:/.test(href) ? ' target="_blank" rel="noreferrer noopener"' : "";
const link = ({ label, href }) =>
  `<a href="${esc(href)}"${ext(href)}>${esc(label)}</a>`;

// One pass over the source, so a replacement can never be re-matched by a later rule.
const highlight = (src) =>
  esc(src).replace(
    /(\/\/[^\n]*)|('[^']*'|"[^"]*"|`[^`]*`)|\b(import|from|export|const|let|return|async|await|true|false)\b|([A-Za-z_$][\w$]*)(?=\()/g,
    (_m, com, str, kw, fn) =>
      com
        ? `<i class="c-com">${com}</i>`
        : str
          ? `<i class="c-str">${str}</i>`
          : kw
            ? `<i class="c-kw">${kw}</i>`
            : `<i class="c-fn">${fn}</i>`,
  );

const copyBtn = (text) =>
  `<button class="copy" type="button" data-copy="${esc(text)}" aria-label="Copy to clipboard">${icon("copy")}</button>`;

document.getElementById("nav").innerHTML = `
  <a class="nav__brand" href="${esc(brand.url)}">
    <img src="${esc(brand.logo)}" alt="" width="26" height="26" />${esc(brand.name)}
  </a>
  <div class="nav__links">
    ${nav.links.map((l) => `<a class="nav__link" href="${esc(l.href)}"${ext(l.href)}>${esc(l.label)}</a>`).join("")}
    ${nav.social
      .map(
        (s) =>
          `<a class="icon-link" href="${esc(s.href)}" aria-label="${esc(s.label)}" target="_blank" rel="noreferrer noopener">${icon(s.icon)}</a>`,
      )
      .join("")}
  </div>`;

document.getElementById("main").innerHTML = `
  <header class="hero">
    <div class="container">
      <p class="eyebrow" style="margin:0"><span class="dot"></span>${esc(hero.eyebrow)}</p>
      <h1>${esc(hero.title)} <span class="accent">${esc(hero.titleAccent)}</span></h1>
      <p class="hero__lead">${esc(hero.lead)}</p>
      <div class="hero__actions">
        ${hero.actions
          .map(
            (a) =>
              `<a class="btn${a.variant === "outline" ? " btn--outline" : ""}" href="${esc(a.href)}"${ext(a.href)}>${esc(a.label)}${icon(a.icon)}</a>`,
          )
          .join("")}
      </div>
      <div class="install">
        <span class="prompt">$</span><code>${esc(hero.install)}</code>${copyBtn(hero.install)}
      </div>
      <ul class="stats" style="list-style:none;padding:0">
        ${stats.map((s) => `<li><b>${esc(s.value)}</b><span>${esc(s.label)}</span></li>`).join("")}
      </ul>
    </div>
  </header>

  <section class="section section--tint">
    <div class="container">
      <div class="measure">
        <h2>${esc(packages.title)}</h2>
        <p class="section__body">${esc(packages.body)}</p>
      </div>
      <div class="pkgs">
        ${packages.items
          .map(
            (p) => `
          <a class="card pkg" href="${esc(p.href)}"${ext(p.href)}>
            <div class="pkg__head">
              ${icon("box")}<span class="pkg__name">${esc(p.name)}</span>
              ${p.version ? `<span class="pkg__version">v${esc(p.version)}</span>` : ""}
            </div>
            <p>${esc(p.description)}</p>
            ${p.tags?.length ? `<div class="pkg__tags">${p.tags.map((t) => `<span>${esc(t)}</span>`).join("")}</div>` : ""}
          </a>`,
          )
          .join("")}
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="measure">
        <h2>${esc(usage.title)}</h2>
        <p class="section__body">${esc(usage.body)}</p>
      </div>
      <div class="code">
        <div class="code__bar">
          ${icon("code")}<span class="code__file">${esc(usage.filename)}</span>${copyBtn(usage.code)}
        </div>
        <pre><code>${highlight(usage.code)}</code></pre>
      </div>
      ${usage.note ? `<p class="code__note">${esc(usage.note)}</p>` : ""}
    </div>
  </section>

  <section class="section section--tint">
    <div class="container">
      <div class="measure">
        <h2>${esc(principles.title)}</h2>
        <p class="section__body">${esc(principles.body)}</p>
      </div>
      <div class="grid">
        ${principles.items
          .map(
            (p) =>
              `<div class="card">${icon(p.icon)}<strong>${esc(p.title)}</strong><p>${esc(p.body)}</p></div>`,
          )
          .join("")}
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="measure">
        <h2>${esc(showcase.title)}</h2>
        <p class="section__body">${esc(showcase.body)}</p>
      </div>
      <figure class="shot">
        <picture>
          <source srcset="${esc(showcase.imageDark)}" media="(prefers-color-scheme: dark)" />
          <img src="${esc(showcase.imageLight)}" alt="${esc(showcase.alt)}"
               width="${esc(showcase.width)}" height="${esc(showcase.height)}" />
        </picture>
        <figcaption>${esc(showcase.caption)}</figcaption>
      </figure>
    </div>
  </section>`;

document.getElementById("footer").innerHTML = `
  <div class="footer__grid">
    <div>
      <div class="footer__brand">
        <img src="${esc(brand.logo)}" alt="" width="24" height="24" />${esc(brand.name)}
      </div>
      <p class="footer__blurb">${esc(footer.blurb)}</p>
    </div>
    ${footer.columns
      .map(
        (c) =>
          `<div class="footer__col"><h3>${esc(c.title)}</h3>${c.links.map(link).join("")}</div>`,
      )
      .join("")}
  </div>
  <div class="footer__legal">${esc(footer.legal)}</div>`;

document.title = `${brand.name} Open Source — ${hero.title} ${hero.titleAccent}`;
document.body.dataset.ready = "";

document.addEventListener("click", async (event) => {
  const button = event.target.closest(".copy");
  if (!button) return;
  try {
    await navigator.clipboard.writeText(button.dataset.copy);
  } catch {
    return; // No clipboard permission (or no https) — leave the button alone.
  }
  button.dataset.copied = "";
  button.innerHTML = `<svg class="icon" aria-hidden="true"><use href="#i-check" /></svg>`;
  setTimeout(() => {
    delete button.dataset.copied;
    button.innerHTML = `<svg class="icon" aria-hidden="true"><use href="#i-copy" /></svg>`;
  }, 1500);
});
