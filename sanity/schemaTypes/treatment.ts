import { HeartIcon } from "@sanity/icons/Heart";
import { defineArrayMember, defineField, defineType } from "sanity";

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

export const treatment = defineType({
  name: "treatment",
  title: "Treatment",
  type: "document",
  icon: HeartIcon,
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", type: "slug", options: { source: "title", maxLength: 96 }, validation: (r) => r.required() }),
    defineField({
      name: "audience",
      title: "Who is it for?",
      type: "string",
      options: {
        list: [
          { title: "Kids", value: "kids" },
          { title: "Adults", value: "adults" },
          { title: "Kids & adults", value: "both" },
        ],
        layout: "radio",
      },
      initialValue: "both",
      validation: (r) => r.required(),
    }),
    defineField({ name: "category", type: "string", options: { list: treatmentCategories }, validation: (r) => r.required() }),
    defineField({ name: "summary", type: "text", rows: 3, description: "One or two sentences, shown on cards.", validation: (r) => r.required().max(220) }),
    defineField({ name: "image", type: "imageWithAlt" }),
    defineField({ name: "body", title: "Details", type: "blockContent" }),
    defineField({
      name: "faqs",
      title: "Questions about this treatment",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "qa",
          fields: [
            defineField({ name: "question", type: "string", validation: (r) => r.required() }),
            defineField({ name: "answer", type: "text", rows: 4, validation: (r) => r.required() }),
          ],
          preview: { select: { title: "question" } },
        }),
      ],
    }),
    defineField({ name: "related", title: "Related treatments", type: "array", of: [defineArrayMember({ type: "reference", to: [{ type: "treatment" }] })], validation: (r) => r.max(4) }),
    defineField({ name: "order", type: "number", description: "Lower numbers appear first.", initialValue: 100 }),
    defineField({ name: "seo", type: "seo" }),
  ],
  orderings: [
    { title: "Display order", name: "order", by: [{ field: "order", direction: "asc" }, { field: "title", direction: "asc" }] },
  ],
  preview: {
    select: { title: "title", audience: "audience", media: "image" },
    prepare: ({ title, audience, media }) => ({
      title,
      subtitle: audience === "kids" ? "Kids" : audience === "adults" ? "Adults" : "Kids & adults",
      media,
    }),
  },
});
