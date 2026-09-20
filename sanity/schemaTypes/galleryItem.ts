import { ImagesIcon } from "@sanity/icons/Images";
import { defineField, defineType } from "sanity";

export const galleryItem = defineType({
  name: "galleryItem",
  title: "Gallery item",
  type: "document",
  icon: ImagesIcon,
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "kind",
      title: "Type",
      type: "string",
      options: { list: [{ title: "Clinic photo", value: "clinic" }, { title: "Before & after", value: "beforeAfter" }], layout: "radio" },
      initialValue: "clinic",
      validation: (r) => r.required(),
    }),
    defineField({ name: "image", title: "Photo", type: "imageWithAlt", hidden: ({ parent }) => parent?.kind === "beforeAfter" }),
    defineField({ name: "beforeImage", title: "Before", type: "imageWithAlt", hidden: ({ parent }) => parent?.kind !== "beforeAfter" }),
    defineField({ name: "afterImage", title: "After", type: "imageWithAlt", hidden: ({ parent }) => parent?.kind !== "beforeAfter" }),
    defineField({ name: "treatment", type: "reference", to: [{ type: "treatment" }] }),
    defineField({ name: "caption", type: "string" }),
    defineField({
      name: "consent",
      title: "Patient has agreed to their photos being published",
      type: "boolean",
      description: "Required for before & after photos.",
      initialValue: false,
      validation: (r) =>
        r.custom((value, context) => {
          const kind = (context.document as { kind?: string } | undefined)?.kind;
          return kind === "beforeAfter" && value !== true ? "Consent is required for before & after photos." : true;
        }),
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "kind", clinic: "image", before: "beforeImage" },
    prepare: ({ title, subtitle, clinic, before }) => ({
      title,
      subtitle: subtitle === "beforeAfter" ? "Before & after" : "Clinic photo",
      media: clinic ?? before,
    }),
  },
});
