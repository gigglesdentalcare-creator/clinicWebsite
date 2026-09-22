import { site, type SiteInfo } from "@/lib/site";

// Structured data (schema.org) describing the clinic, read by search engines to power rich
// results — e.g. a knowledge panel with phone/address, or "dentist near me" local results.
// Check it with Google's Rich Results Test (search.google.com/test/rich-results) once live.
export default function LocalBusinessJsonLd({ info }: { info: SiteInfo }) {
  const data = {
    "@context": "https://schema.org",
    // Dentist is a schema.org subtype of MedicalBusiness/LocalBusiness — more specific (and
    // so more useful to search engines) than the generic LocalBusiness type.
    "@type": "Dentist",
    name: info.name,
    url: site.url,
    telephone: info.phone,
    ...(info.logo && { image: info.logo.url }),
    address: {
      "@type": "PostalAddress",
      streetAddress: info.address.line1,
      addressLocality: info.address.city,
      addressRegion: info.address.region,
      addressCountry: "IN",
    },
  };

  return (
    <script
      type="application/ld+json"
      // JSON.stringify never produces a literal "</", but CMS-sourced strings (e.g. the clinic
      // name) could contain "</script>" — escaping "<" keeps that from breaking out of the tag.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
