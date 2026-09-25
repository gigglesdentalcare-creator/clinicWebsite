import { HomeIcon } from "@sanity/icons/Home";
import { defineArrayMember, defineField, defineType } from "sanity";

export const homePage = defineType({
  name: "homePage",
  title: "Home page",
  type: "document",
  icon: HomeIcon,
  fields: [
    defineField({
      name: "heroHeadline",
      title: "Headline",
      type: "string",
      description: "The big line at the top of the home page. Shown exactly as typed.",
      initialValue: "Smiles that start with Giggles",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "heroHighlight",
      title: "Highlighted word",
      type: "string",
      description: "A word or phrase from the headline to show in blue, e.g. Giggles. Leave empty for none.",
      initialValue: "Giggles",
    }),
    defineField({
      name: "heroSubheadline",
      title: "Subheadline",
      type: "text",
      rows: 3,
      description: "The paragraph under the headline. Leave empty to use the default text.",
    }),
    defineField({ name: "heroImage", type: "imageWithAlt", description: "Ideally a photo showing both a child and an adult." }),
    defineField({
      name: "heroVideo",
      title: "Hero background video",
      type: "file",
      options: { accept: "video/mp4,video/webm" },
      description:
        "Plays silently, in black and white, behind the home page headline. Use a short (10–20 second) looping clip, ideally under 8 MB — MP4 (H.264) plays everywhere. Only use footage where any patient shown has agreed to appear. Remove it to go back to the plain background.",
    }),
    defineField({
      name: "trustStats",
      title: "Trust strip",
      type: "array",
      description: "Short highlights such as “10+ years” or “5,000+ smiles”. Only add figures that are accurate.",
      of: [
        defineArrayMember({
          type: "object",
          name: "stat",
          fields: [
            defineField({ name: "value", type: "string", validation: (r) => r.required() }),
            defineField({ name: "label", type: "string", validation: (r) => r.required() }),
          ],
          preview: { select: { title: "value", subtitle: "label" } },
        }),
      ],
      validation: (r) => r.max(4),
    }),
    defineField({ name: "featuredTreatments", type: "array", of: [defineArrayMember({ type: "reference", to: [{ type: "treatment" }] })], validation: (r) => r.max(6) }),
    defineField({ name: "featuredDoctors", type: "array", of: [defineArrayMember({ type: "reference", to: [{ type: "doctor" }] })] }),
    defineField({ name: "featuredTestimonials", type: "array", of: [defineArrayMember({ type: "reference", to: [{ type: "testimonial" }] })], validation: (r) => r.max(6) }),
  ],
  preview: { prepare: () => ({ title: "Home page" }) },
});
