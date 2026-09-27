import { NextResponse } from "next/server";
import { getProductDetails } from "@/lib/product-link";
import { checkRequest } from "./guard";

// GET /api/product-details?url=… → { title, imageUrl } for a product link, used by the
// "Fetch title & photo" button in Studio (sanity/components/ProductLinkInput.tsx).
export async function GET(request: Request) {
  const url = checkRequest(request);
  if (typeof url !== "string") return url;

  const { title, imageUrl } = await getProductDetails(url);
  if (!title && !imageUrl) {
    return NextResponse.json({ message: "Couldn't read that page — add the name and photo by hand." }, { status: 422 });
  }
  return NextResponse.json({ title, imageUrl });
}
