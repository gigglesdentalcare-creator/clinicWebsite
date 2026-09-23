import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

// Static routes today. Phase 3 adds dynamic ones like /treatments/[slug] and /blog/[slug] —
// extend this by mapping their slug queries (sanity/lib/queries.ts) into more entries here,
// the same way treatmentSlugsQuery / postSlugsQuery are meant to be used.
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    { url: site.url, lastModified, changeFrequency: "weekly", priority: 1 },
    { url: `${site.url}/contact`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${site.url}/team`, lastModified, changeFrequency: "monthly", priority: 0.7 },
    { url: `${site.url}/recommendations`, lastModified, changeFrequency: "monthly", priority: 0.6 },
  ];
}
