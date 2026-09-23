import { draftMode } from "next/headers";
import type { QueryParams } from "next-sanity";
import { client } from "./client";
import { sanityFetch } from "./live";

// How long published content may be served from the Next.js cache before it's re-fetched.
// This is a safety net: the webhook (app/api/revalidate) refreshes content instantly when it's
// set up and working, but `sanityFetch` alone caches *indefinitely* until a tag is invalidated —
// so one missed publish event would leave stale content on the site until the next redeploy.
const REVALIDATE_SECONDS = 60;

// Fetches content for a page. Published content is cached for at most REVALIDATE_SECONDS and is
// also tagged, so the webhook can still refresh it immediately. In draft mode (Studio's
// Presentation tool) it goes through `sanityFetch` instead, which serves unpublished content.
// `stega` is off either way: these values feed hrefs, tel: links, alt text, etc.
export async function fetchContent<const Query extends string>({
  query,
  params = {},
  tags,
}: {
  query: Query;
  params?: QueryParams;
  tags: string[];
}) {
  if ((await draftMode()).isEnabled) {
    const { data } = await sanityFetch({ query, params, tags, stega: false });
    return data;
  }
  return client.withConfig({ stega: false }).fetch(query, params, {
    next: { revalidate: REVALIDATE_SECONDS, tags },
  });
}
