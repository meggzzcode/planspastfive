import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { articleSchema, productSchema } from "./lib/schemas.mjs";

const articles = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/articles" }),
  schema: articleSchema,
});

const products = defineCollection({
  loader: glob({ pattern: "*.json", base: "./src/content/products" }),
  schema: productSchema,
});

export const collections = { articles, products };
