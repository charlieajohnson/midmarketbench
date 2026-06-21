import type { MetadataRoute } from "next";
import { getRepository } from "@/lib/repo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const repo = getRepository();
  const [models, cases, tasks] = await Promise.all([repo.getModels(), repo.getCases(), repo.getTasks()]);
  const paths = [
    "",
    "/methodology",
    "/cases",
    "/models",
    "/about",
    ...models.map((item) => `/models/${item.slug}`),
    ...cases.map((item) => `/cases/${item.slug}`),
    ...tasks.map((item) => `/tasks/${item.key}`),
  ];
  return paths.map((path) => ({ url: `${base}${path}`, lastModified: new Date("2026-06-21") }));
}
