import { CogIcon } from "@sanity/icons/Cog";
import { defineArrayMember, defineField, defineType } from "sanity";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Clinic details & settings",
  type: "document",
  icon: CogIcon,
  groups: [
    { name: "general", title: "General", default: true },
    { name: "contact", title: "Contact & address" },
    { name: "hours", title: "Opening hours" },
    { name: "social", title: "Social & reviews" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({ name: "name", type: "string", group: "general", initialValue: "Giggles Dental Care", validation: (r) => r.required() }),
    defineField({ name: "tagline", type: "string", group: "general", initialValue: "Family dentistry for every smile" }),
    defineField({ name: "logo", type: "imageWithAlt", group: "general" }),

    defineField({
      name: "phone",
      type: "string",
      group: "contact",
      description: "Shown on the site and used for tap-to-call. Example: +91 98765 43210",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "whatsapp",
      title: "WhatsApp number",
      type: "string",
      group: "contact",
      description: "With country code. Example: +91 98765 43210",
    }),
    defineField({ name: "email", type: "string", group: "contact", validation: (r) => r.email() }),
    defineField({ name: "addressLine1", title: "Address", type: "string", group: "contact", initialValue: "Sri Ram Nagar, Kondapur" }),
    defineField({ name: "city", type: "string", group: "contact", initialValue: "Hyderabad" }),
    defineField({ name: "region", title: "State", type: "string", group: "contact", initialValue: "Telangana" }),
    defineField({ name: "postalCode", type: "string", group: "contact" }),
    defineField({ name: "geo", title: "Map location", type: "geopoint", group: "contact", description: "Used for the map and for Google's local business data." }),
    defineField({ name: "mapsUrl", title: "Google Maps link", type: "url", group: "contact" }),

    defineField({
      name: "hours",
      title: "Opening hours",
      type: "array",
      group: "hours",
      of: [
        defineArrayMember({
          type: "object",
          name: "dayHours",
          fields: [
            defineField({ name: "day", type: "string", options: { list: days }, validation: (r) => r.required() }),
            defineField({ name: "closed", type: "boolean", initialValue: false }),
            defineField({ name: "opens", type: "string", description: "24-hour time, e.g. 09:30", hidden: ({ parent }) => parent?.closed }),
            defineField({ name: "closes", type: "string", description: "24-hour time, e.g. 20:00", hidden: ({ parent }) => parent?.closed }),
          ],
          preview: {
            select: { title: "day", closed: "closed", opens: "opens", closes: "closes" },
            prepare: ({ title, closed, opens, closes }) => ({
              title,
              subtitle: closed ? "Closed" : `${opens ?? "?"} – ${closes ?? "?"}`,
            }),
          },
        }),
      ],
    }),

    defineField({
      name: "socialLinks",
      type: "array",
      group: "social",
      of: [
        defineArrayMember({
          type: "object",
          name: "socialLink",
          fields: [
            defineField({ name: "platform", type: "string", options: { list: ["Instagram", "Facebook", "YouTube", "X", "LinkedIn"] }, validation: (r) => r.required() }),
            defineField({ name: "url", type: "url", validation: (r) => r.required() }),
          ],
          preview: { select: { title: "platform", subtitle: "url" } },
        }),
      ],
    }),
    defineField({ name: "googleReviewUrl", title: "Google review link", type: "url", group: "social", description: "Link that opens the 'write a review' box on your Google Business Profile." }),

    defineField({ name: "defaultSeo", title: "Default SEO", type: "seo", group: "seo" }),
  ],
  preview: { prepare: () => ({ title: "Clinic details & settings" }) },
});
