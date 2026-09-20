import { defineLive } from "next-sanity/live";
import { readToken } from "../env";
import { client } from "./client";

// `sanityFetch` serves published content from the Next.js cache and, in draft mode,
// unpublished content (needs the read token). `<SanityLive />` is only rendered in draft
// mode — production freshness comes from the webhook in app/api/revalidate.
export const { sanityFetch, SanityLive } = defineLive({
  client,
  serverToken: readToken,
});
