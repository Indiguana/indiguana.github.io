import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const writeups = defineCollection({
	loader: glob({ pattern: "**/*.md", base: "./src/content/writeups" }),
	schema: z.object({
		title: z.string(),
	}),
});

export const collections = { writeups };
