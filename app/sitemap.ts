import type { MetadataRoute } from "next";
import { getRepository } from "@/lib/repo";
import { siteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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
  return paths.map((path) => ({ url: `${siteUrl}${path}`, lastModified: new Date("2026-06-21") }));
}
