import { NextResponse } from "next/server";
import { isPublicHttpUrl } from "@/lib/product-link";

// Both product-details routes are only for the Studio (served from this same site at /studio):
// browsers mark those requests `Sec-Fetch-Site: same-origin`, so other websites can't use this
// server to fetch pages for them. Returns an error response, or the validated URL.
export function checkRequest(request: Request): NextResponse | string {
  const site = request.headers.get("sec-fetch-site");
  if (site && site !== "same-origin") {
    return NextResponse.json({ message: "Only available from the Studio" }, { status: 403 });
  }
  const url = new URL(request.url).searchParams.get("url")?.trim() ?? "";
  if (!isPublicHttpUrl(url)) {
    return NextResponse.json({ message: "Paste a full web address starting with https://" }, { status: 400 });
  }
  return url;
}
