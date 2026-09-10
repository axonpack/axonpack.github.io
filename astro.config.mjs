import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

export default defineConfig({
  // Static by default — Astro prerenders to a plain directory of HTML. GitHub Pages cannot run a
  // server, so there is deliberately no adapter and no SSR here.
  output: "static",
  // axonpack.github.io is the organisation root site, so the app owns "/" and needs no base. The
  // docs repo is a project site and does need one. `site` is what lets sitemap emit absolute URLs.
  site: "https://axonpack.github.io",
  trailingSlash: "always",
  integrations: [react(), sitemap()],
  vite: { plugins: [tailwindcss()] },
});
