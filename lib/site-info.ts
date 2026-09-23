import { fetchContent } from "@/sanity/lib/fetch";
import { siteSettingsQuery } from "@/sanity/lib/queries";
import { tagsFor } from "@/sanity/lib/tags";
import { site, type SiteInfo, type SocialLink } from "./site";

// Digits only, defaulting a bare 10-digit number to India's country code (91).
const normaliseNumber = (value: string) => {
  const digits = value.replace(/\D/g, "");
  return digits.length === 10 ? `91${digits}` : digits;
};

// Google Maps search URL, needs no API key — used whenever no explicit `mapsUrl` is set in Studio.
function mapsSearchUrl(addressParts: Array<string | null | undefined>) {
  const query = addressParts.filter(Boolean).join(", ");
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

const defaultAddress = { ...site.address, postalCode: null };

const defaults: SiteInfo = {
  name: site.name,
  tagline: site.tagline,
  phone: site.phone,
  phoneDisplay: site.phoneDisplay,
  whatsapp: site.whatsapp,
  email: null,
  address: defaultAddress,
  mapsUrl: mapsSearchUrl(Object.values(defaultAddress)),
  hours: [],
  socialLinks: [],
  logo: null,
};

// Clinic details from the CMS, falling back to lib/site.ts for anything not filled in yet
// (or if Sanity can't be reached), so a CMS hiccup never breaks the whole site.
export async function getSiteInfo(): Promise<SiteInfo> {
  try {
    const data = await fetchContent({ query: siteSettingsQuery, tags: tagsFor("siteSettings") });
    if (!data) return defaults;

    const phoneDigits = data.phone ? normaliseNumber(data.phone) : "";
    const whatsappDigits = data.whatsapp ? normaliseNumber(data.whatsapp) : "";
    const address = {
      line1: data.addressLine1 ?? defaults.address.line1,
      city: data.city ?? defaults.address.city,
      region: data.region ?? defaults.address.region,
      postalCode: data.postalCode ?? defaults.address.postalCode,
    };
    return {
      name: data.name ?? defaults.name,
      tagline: data.tagline ?? defaults.tagline,
      phone: phoneDigits ? `+${phoneDigits}` : defaults.phone,
      phoneDisplay: data.phone ?? defaults.phoneDisplay,
      whatsapp: whatsappDigits || (phoneDigits ? phoneDigits : defaults.whatsapp),
      email: data.email ?? defaults.email,
      address,
      mapsUrl: data.mapsUrl || mapsSearchUrl(Object.values(address)),
      hours: (data.hours ?? [])
        .filter((entry): entry is typeof entry & { day: string } => Boolean(entry.day))
        .map((entry) => ({ day: entry.day, closed: entry.closed ?? false, opens: entry.opens, closes: entry.closes })),
      socialLinks: (data.socialLinks ?? [])
        .filter((link) => link.platform && link.url)
        .map((link): SocialLink => ({ platform: link.platform!, url: link.url! })),
      logo:
        data.logo?.url && data.logo.width && data.logo.height
          ? {
              url: data.logo.url,
              width: data.logo.width,
              height: data.logo.height,
              alt: data.logo.alt ?? data.name ?? defaults.name,
            }
          : null,
    };
  } catch (error) {
    console.error("Could not load site settings from Sanity, using defaults.", error);
    return defaults;
  }
}
