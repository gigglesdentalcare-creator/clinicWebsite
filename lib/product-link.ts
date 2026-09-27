// Reads a product's title and photo from a shop link (mostly Amazon), for the "Fetch title &
// photo" button in Studio (sanity/components/ProductLinkInput.tsx, via app/api/product-details).
//
// Amazon often answers server requests with a captcha page instead of the product, so this
// tries, in order: the page itself, then Microlink (a free link-preview service that gets past
// that), then — for Amazon only — the image Amazon serves by product ID and a title built from
// the words in the URL. Whatever is found is only a starting point: editors can change both.

const BROWSER_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36",
  "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  "Accept-Language": "en-IN,en;q=0.9",
};
const TIMEOUT_MS = 12_000;
const MAX_IMAGE_BYTES = 8 * 1024 * 1024;

export type ProductDetails = { title: string | null; imageUrl: string | null; finalUrl: string };

// Only public http(s) addresses — never localhost or a private network, so the route can't be
// used to probe whatever sits next to the server.
export function isPublicHttpUrl(value: string): boolean {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return false;
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") return false;
  const host = url.hostname.toLowerCase().replace(/^\[|\]$/g, "");
  if (host === "localhost" || host.endsWith(".localhost") || host.endsWith(".local") || host.endsWith(".internal")) {
    return false;
  }
  if (/^(0|10|127)\.|^169\.254\.|^192\.168\.|^172\.(1[6-9]|2\d|3[01])\./.test(host)) return false;
  if (host.includes(":")) return false; // IPv6 literals: no product shop is linked that way
  return true;
}

const isAmazon = (url: string) => /(^|\.)(amazon\.[a-z.]+|amzn\.[a-z]+|a\.co)$/i.test(new URL(url).hostname);

function decodeEntities(text: string) {
  return text
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(parseInt(code, 16)))
    .replace(/&quot;/g, '"')
    .replace(/&apos;|&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&");
}

const clean = (text: string | undefined | null) => {
  const value = text ? decodeEntities(text).replace(/\s+/g, " ").trim() : "";
  return value || null;
};

function metaContent(html: string, key: string) {
  // <meta property="og:title" content="…"> with the attributes in either order.
  const escaped = key.replace(/[.:]/g, "\\$&");
  const match =
    html.match(new RegExp(`<meta[^>]+(?:property|name)=["']${escaped}["'][^>]*content=["']([^"']*)["']`, "i")) ??
    html.match(new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]*(?:property|name)=["']${escaped}["']`, "i"));
  return clean(match?.[1]);
}

function absolute(src: string | null, base: string) {
  if (!src) return null;
  try {
    return new URL(src, base).toString();
  } catch {
    return null;
  }
}

function parseHtml(html: string, pageUrl: string): Omit<ProductDetails, "finalUrl"> {
  // Amazon's own markup first (its og: tags are often missing), then the standard tags every
  // shop sets for link previews.
  const amazonTitle = clean(html.match(/<span[^>]*id=["']productTitle["'][^>]*>([\s\S]*?)<\/span>/i)?.[1]);
  const amazonImage =
    html.match(/data-old-hires=["'](https:[^"']+)["']/i)?.[1] ??
    html.match(/"hiRes":"(https:[^"]+)"/)?.[1] ??
    html.match(/id=["']landingImage["'][^>]*src=["'](https:[^"']+)["']/i)?.[1];

  const title =
    amazonTitle ??
    metaContent(html, "og:title") ??
    metaContent(html, "twitter:title") ??
    clean(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]);
  const image = amazonImage ?? metaContent(html, "og:image") ?? metaContent(html, "twitter:image");

  // Amazon's "Page Not Found" / captcha pages have generic titles — treat those as nothing found.
  const useless = !title || /^(amazon(\.[a-z.]+)?|page not found|robot check|sorry!.*)$/i.test(title);
  return { title: useless ? null : title, imageUrl: absolute(image ?? null, pageUrl) };
}

async function fetchWithTimeout(url: string, init: RequestInit = {}) {
  return fetch(url, { ...init, redirect: "follow", signal: AbortSignal.timeout(TIMEOUT_MS), cache: "no-store" });
}

async function fromPage(url: string): Promise<ProductDetails> {
  const response = await fetchWithTimeout(url, { headers: BROWSER_HEADERS });
  const finalUrl = response.url || url;
  if (!response.ok || !(response.headers.get("content-type") ?? "").includes("html")) {
    return { title: null, imageUrl: null, finalUrl };
  }
  return { ...parseHtml(await response.text(), finalUrl), finalUrl };
}

async function fromMicrolink(url: string): Promise<Omit<ProductDetails, "finalUrl">> {
  const response = await fetchWithTimeout(`https://api.microlink.io/?url=${encodeURIComponent(url)}`);
  if (!response.ok) return { title: null, imageUrl: null };
  const body = (await response.json()) as {
    status?: string;
    statusCode?: number;
    data?: { title?: string | null; image?: { url?: string } | null };
  };
  if (body.status !== "success" || (body.statusCode && body.statusCode >= 400)) return { title: null, imageUrl: null };
  const title = clean(body.data?.title);
  const useless = !title || /^(amazon(\.[a-z.]+)?|page not found|robot check)$/i.test(title);
  return { title: useless ? null : title, imageUrl: body.data?.image?.url ?? null };
}

// Amazon product IDs (ASINs) appear as /dp/XXXXXXXXXX or /gp/product/XXXXXXXXXX.
const asinOf = (url: string) => url.match(/\/(?:dp|gp\/product|gp\/aw\/d)\/([A-Z0-9]{10})(?:[/?]|$)/i)?.[1]?.toUpperCase();

// The words before /dp/ in a long Amazon link are the product's name, e.g.
// amazon.in/Colgate-Sensitive-Everyday-Protection-Toothpaste/dp/B07QL37M78.
function titleFromAmazonUrl(url: string) {
  const slug = new URL(url).pathname.match(/^\/([^/]+)\/(?:dp|gp\/product)\//)?.[1];
  return slug ? clean(decodeURIComponent(slug).replace(/[-_]+/g, " ")) : null;
}

async function amazonImageByAsin(asin: string) {
  const imageUrl = `https://images-na.ssl-images-amazon.com/images/P/${asin}.01._SCLZZZZZZZ_.jpg`;
  const response = await fetchWithTimeout(imageUrl, { headers: BROWSER_HEADERS });
  const bytes = await response.arrayBuffer();
  // For an unknown product Amazon still answers 200, with a 1×1 placeholder gif.
  return response.ok && (response.headers.get("content-type") ?? "").startsWith("image/jpeg") && bytes.byteLength > 1000
    ? imageUrl
    : null;
}

export async function getProductDetails(url: string): Promise<ProductDetails> {
  let details: ProductDetails = { title: null, imageUrl: null, finalUrl: url };
  try {
    details = await fromPage(url);
  } catch (error) {
    console.warn("Could not read the product page directly.", error);
  }

  if (!details.title || !details.imageUrl) {
    try {
      const preview = await fromMicrolink(details.finalUrl);
      details = { ...details, title: details.title ?? preview.title, imageUrl: details.imageUrl ?? preview.imageUrl };
    } catch (error) {
      console.warn("Microlink could not read the product page.", error);
    }
  }

  if ((!details.title || !details.imageUrl) && isAmazon(details.finalUrl)) {
    details.title ??= titleFromAmazonUrl(details.finalUrl) ?? titleFromAmazonUrl(url);
    const asin = asinOf(details.finalUrl) ?? asinOf(url);
    if (!details.imageUrl && asin) {
      try {
        details.imageUrl = await amazonImageByAsin(asin);
      } catch (error) {
        console.warn("Could not load the Amazon image by product ID.", error);
      }
    }
  }

  return details;
}

// Downloads the product photo so Studio can store its own copy in Sanity (Amazon's image
// servers don't allow the browser to fetch them directly).
export async function downloadImage(imageUrl: string) {
  if (!isPublicHttpUrl(imageUrl)) return null;
  const response = await fetchWithTimeout(imageUrl, { headers: BROWSER_HEADERS });
  const contentType = response.headers.get("content-type") ?? "";
  if (!response.ok || !contentType.startsWith("image/")) return null;
  const bytes = await response.arrayBuffer();
  if (bytes.byteLength < 1000 || bytes.byteLength > MAX_IMAGE_BYTES) return null;
  return { contentType: contentType.split(";")[0], bytes };
}
