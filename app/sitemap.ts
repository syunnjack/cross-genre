import type { MetadataRoute } from "next";
import genresData from "@/data/genres.json";
import cities from "@/data/cities.json";
import { isPlaceholderPage } from "@/lib/offers";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://kurabe-kurashi.jp";
  const genres = Object.keys(genresData);
  const pages: MetadataRoute.Sitemap = [{ url: `${base}/`, lastModified: new Date() }];
  for (const genre of genres) {
    for (const city of cities as { id: string; pref: string }[]) {
      // 提携先が無く「準備中」と出るだけのページは載せない（noindex と揃える）
      if (isPlaceholderPage(genre, city.pref)) continue;
      pages.push({ url: `${base}/${genre}/${city.id}`, lastModified: new Date() });
    }
  }
  return pages;
}
