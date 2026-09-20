import { sanityFetch } from "@/sanity/lib/live";
import { siteSettingsQuery } from "@/sanity/lib/queries";
import { tagsFor } from "@/sanity/lib/tags";
import { site, type SiteInfo } from "./site";

// Digits only, defaulting a bare 10-digit number to India's country code (91).
const normaliseNumber = (value: string) => {
  const digits = value.replace(/\D/g, "");
  return digits.length === 10 ? `91${digits}` : digits;
};

const defaults: SiteInfo = {
  name: site.name,
  tagline: site.tagline,
  phone: site.phone,
  phoneDisplay: site.phoneDisplay,
  whatsapp: site.whatsapp,
  address: { ...site.address },
};

// Clinic details from the CMS, falling back to lib/site.ts for anything not filled in yet
// (or if Sanity can't be reached), so a CMS hiccup never breaks the whole site.
export async function getSiteInfo(): Promise<SiteInfo> {
  try {
    const { data } = await sanityFetch({
      query: siteSettingsQuery,
      tags: tagsFor("siteSettings"),
      stega: false, // values feed href/tel links, so keep them free of stega characters
    });
    if (!data) return defaults;

    const phoneDigits = data.phone ? normaliseNumber(data.phone) : "";
    const whatsappDigits = data.whatsapp ? normaliseNumber(data.whatsapp) : "";
    return {
      name: data.name ?? defaults.name,
      tagline: data.tagline ?? defaults.tagline,
      phone: phoneDigits ? `+${phoneDigits}` : defaults.phone,
      phoneDisplay: data.phone ?? defaults.phoneDisplay,
      whatsapp: whatsappDigits || (phoneDigits ? phoneDigits : defaults.whatsapp),
      address: {
        line1: data.addressLine1 ?? defaults.address.line1,
        city: data.city ?? defaults.address.city,
        region: data.region ?? defaults.address.region,
      },
    };
  } catch (error) {
    console.error("Could not load site settings from Sanity, using defaults.", error);
    return defaults;
  }
}
