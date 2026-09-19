// Central clinic details. Phase 2 moves these into the Sanity `siteSettings`
// document; until then the values below are PLACEHOLDERS to be replaced with
// the clinic's real phone/WhatsApp numbers and hours.
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

export const navLinks = [
  { href: "/treatments", label: "Treatments" },
  { href: "/kids-dentistry", label: "Kids" },
  { href: "/team", label: "Our Team" },
  { href: "/gallery", label: "Gallery" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
] as const;

export function whatsappLink(message = "Hi Giggles Dental Care, I'd like to book an appointment.") {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
}
