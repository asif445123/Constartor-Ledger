import { MetadataRoute } from "next";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://yourdomain.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/login"],
      disallow: ["/", "/malik", "/mazdoor", "/kharcha", "/site", "/admin", "/api"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
