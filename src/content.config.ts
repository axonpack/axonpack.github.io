import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";

// Hand-written posts. Release notes are not here — they come from each library's CHANGELOG.md at
// build time, so nobody has to copy a changeset into a blog post by hand.
const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    author: z.string().default("Axonpack"),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
