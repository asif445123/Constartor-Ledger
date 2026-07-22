import { MetadataRoute } from "next";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://constartor-ledger.onrender.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/login"],
      disallow: ["/", "/malik", "/mazdoor", "/kharcha", "/site", "/admin", "/reset-password", "/api"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
