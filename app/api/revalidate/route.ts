import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";
import { tagFor } from "@/sanity/lib/tags";

type WebhookPayload = { _type?: string };

// Called by a Sanity webhook whenever a document is published, edited or deleted.
// Expires the cache tag of that document type so the next visit renders fresh content.
export async function POST(req: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) {
    return NextResponse.json({ message: "SANITY_REVALIDATE_SECRET is not configured" }, { status: 500 });
  }

  const { isValidSignature, body } = await parseBody<WebhookPayload>(req, secret, true);
  if (!isValidSignature) {
    return NextResponse.json({ message: "Invalid signature" }, { status: 401 });
  }
  if (!body?._type) {
    return NextResponse.json({ message: "Webhook payload must include _type" }, { status: 400 });
  }

  const tag = tagFor(body._type);
  // { expire: 0 }: no stale content is served, so an editor's change shows on the very next visit.
  revalidateTag(tag, { expire: 0 });
  return NextResponse.json({ revalidated: tag });
}
