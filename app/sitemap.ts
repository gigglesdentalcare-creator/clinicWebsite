import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

// Only the home page exists today. Phase 3 adds routes like /treatments/[slug] and
// /blog/[slug] — extend this by mapping their slug queries (sanity/lib/queries.ts) into
// more entries here, the same way treatmentSlugsQuery / postSlugsQuery are meant to be used.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: site.url,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
