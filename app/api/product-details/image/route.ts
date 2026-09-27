import { NextResponse } from "next/server";
import { downloadImage } from "@/lib/product-link";
import { checkRequest } from "../guard";

// GET /api/product-details/image?url=… → the image itself, so Studio can upload a copy to Sanity
// (shops like Amazon don't let the browser download their images directly).
export async function GET(request: Request) {
  const url = checkRequest(request);
  if (typeof url !== "string") return url;

  const image = await downloadImage(url);
  if (!image) return NextResponse.json({ message: "Couldn't download the photo." }, { status: 422 });
  return new Response(image.bytes, { headers: { "Content-Type": image.contentType, "Cache-Control": "no-store" } });
}
