import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // /studio is the CMS login, not content; the API routes are webhooks/preview endpoints.
      disallow: ["/studio", "/api/"],
    },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
