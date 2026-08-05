import type { MetadataRoute } from "next";
import genresData from "@/data/genres.json";
import cities from "@/data/cities.json";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://kurabe-kurashi.jp";
  const genres = Object.keys(genresData);
  const pages: MetadataRoute.Sitemap = [{ url: `${base}/`, lastModified: new Date() }];
  for (const genre of genres) {
    for (const city of cities as { id: string }[]) {
      pages.push({ url: `${base}/${genre}/${city.id}`, lastModified: new Date() });
    }
  }
  return pages;
}
