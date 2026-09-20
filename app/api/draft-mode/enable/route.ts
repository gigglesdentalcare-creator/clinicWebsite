import { defineEnableDraftMode } from "next-sanity/draft-mode";
import { readToken } from "@/sanity/env";
import { client } from "@/sanity/lib/client";

// Studio's Presentation tool opens this URL (with a signed secret) to turn on draft mode.
export const { GET } = defineEnableDraftMode({
  client: client.withConfig({ token: readToken }),
});
