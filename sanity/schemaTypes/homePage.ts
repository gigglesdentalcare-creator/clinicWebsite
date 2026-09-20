import { HomeIcon } from "@sanity/icons/Home";
import { defineArrayMember, defineField, defineType } from "sanity";

export const homePage = defineType({
  name: "homePage",
  title: "Home page",
  type: "document",
  icon: HomeIcon,
  fields: [
    defineField({ name: "heroHeadline", type: "string", initialValue: "Smiles that start with a giggle.", validation: (r) => r.required() }),
    defineField({ name: "heroSubheadline", type: "text", rows: 3 }),
    defineField({ name: "heroImage", type: "imageWithAlt", description: "Ideally a photo showing both a child and an adult." }),
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
