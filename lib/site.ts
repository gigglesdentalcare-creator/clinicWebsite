// Fallback clinic details. The Sanity `siteSettings` document overrides these
// (see lib/site-info.ts), so the site still renders before any content exists.
// The phone/WhatsApp values are PLACEHOLDERS until the clinic fills them in Studio.
export const site = {
  name: "Giggles Dental Care",
  tagline: "Family dentistry for every smile",
  description:
    "Gentle, family-friendly dental care for children and adults in Sri Ram Nagar, Kondapur, Hyderabad.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  phone: "+910000000000", // PLACEHOLDER
  phoneDisplay: "+91 00000 00000", // PLACEHOLDER
  whatsapp: "910000000000", // PLACEHOLDER (country code + number, no +)
  address: {
    line1: "Sri Ram Nagar, Kondapur",
    city: "Hyderabad",
    region: "Telangana",
  },
} as const;

export type SiteInfo = {
  name: string;
  tagline: string;
  phone: string; // tel: format, e.g. +919876543210
  phoneDisplay: string;
  whatsapp: string; // digits only, e.g. 919876543210
  address: { line1: string; city: string; region: string };
};

export const navLinks = [
  { href: "/treatments", label: "Treatments" },
  { href: "/kids-dentistry", label: "Kids" },
  { href: "/team", label: "Our Team" },
  { href: "/gallery", label: "Gallery" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
] as const;

export function whatsappLink(
  whatsapp: string,
  message = "Hi Giggles Dental Care, I'd like to book an appointment.",
) {
  return `https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`;
}
