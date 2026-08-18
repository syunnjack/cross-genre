import type { MetadataRoute } from "next";

// robots.txt が無く、app/sitemap.ts で作っているサイトマップを
// 検索エンジンに知らせられていなかった。
export default function robots(): MetadataRoute.Robots {
    return {
        rules: { userAgent: "*", allow: "/" },
        sitemap: "https://kurabe-kurashi.jp/sitemap.xml",
    };
}
