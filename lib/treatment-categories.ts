// Treatment categories, shared by the Studio schema (sanity/schemaTypes/treatment.ts) and the
// site. Kept out of the schema file so site pages can import it without bundling Sanity Studio.
export const treatmentCategories = [
  { title: "Check-ups & prevention", value: "preventive" },
  { title: "Fillings & restorations", value: "restorative" },
  { title: "Root canal", value: "endodontics" },
  { title: "Braces & aligners", value: "orthodontics" },
  { title: "Cosmetic & whitening", value: "cosmetic" },
  { title: "Implants & dentures", value: "prosthetics" },
  { title: "Gum care", value: "gum-care" },
  { title: "Extractions & surgery", value: "surgery" },
];
