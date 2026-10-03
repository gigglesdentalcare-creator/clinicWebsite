import { SparklesIcon } from "@sanity/icons/Sparkles";
import { defineField, defineType } from "sanity";

// One before/after case on /smile-stories (and optionally on the home page, picked under
// Home page → Featured smile stories). Only shown once the consent box is ticked.
export const smileCase = defineType({
  name: "smileCase",
  title: "Smile story",
  type: "document",
  icon: SparklesIcon,
  fields: [
    defineField({
      name: "title",
      type: "string",
      description: "Short and plain, e.g. “Gaps closed with clear aligners”.",
      validation: (r) => r.required().max(80),
    }),
    defineField({ name: "treatment", type: "string", description: "e.g. Clear aligners, Composite bonding" }),
    defineField({ name: "duration", title: "Treatment time", type: "string", description: "Optional, e.g. 8 months" }),
    defineField({
      name: "description",
      type: "text",
      rows: 3,
      description: "Optional, a sentence or two about the case.",
      validation: (r) => r.max(300),
    }),
    defineField({
      name: "beforeImage",
      title: "Before",
      type: "imageWithAlt",
      description: "Use the same framing for both photos so the slider lines up. Shown cropped to 4:3 — set the focal point if needed.",
      validation: (r) => r.required(),
    }),
    defineField({ name: "afterImage", title: "After", type: "imageWithAlt", validation: (r) => r.required() }),
    defineField({
      name: "consent",
      title: "Patient has agreed to these photos being published",
      type: "boolean",
      description: "The case stays hidden on the website until this is ticked.",
      initialValue: false,
      validation: (r) => r.custom((value) => (value === true ? true : "Consent is required before publishing.")),
    }),
    defineField({ name: "order", type: "number", description: "Lower numbers appear first.", initialValue: 100 }),
  ],
  orderings: [
    { title: "Display order", name: "order", by: [{ field: "order", direction: "asc" }, { field: "_createdAt", direction: "desc" }] },
  ],
  preview: { select: { title: "title", subtitle: "treatment", media: "afterImage" } },
});
