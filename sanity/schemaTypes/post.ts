import { DocumentTextIcon } from "@sanity/icons/DocumentText";
import { defineField, defineType } from "sanity";

export const post = defineType({
  name: "post",
  title: "Blog post",
  type: "document",
  icon: DocumentTextIcon,
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", type: "slug", options: { source: "title", maxLength: 96 }, validation: (r) => r.required() }),
    defineField({ name: "author", type: "reference", to: [{ type: "doctor" }] }),
    defineField({ name: "coverImage", type: "imageWithAlt" }),
    defineField({ name: "excerpt", type: "text", rows: 3, validation: (r) => r.required().max(220) }),
    defineField({ name: "body", type: "blockContent" }),
    defineField({ name: "publishedAt", type: "datetime", initialValue: () => new Date().toISOString(), validation: (r) => r.required() }),
    defineField({ name: "seo", type: "seo" }),
  ],
  orderings: [{ title: "Newest first", name: "newest", by: [{ field: "publishedAt", direction: "desc" }] }],
  preview: { select: { title: "title", subtitle: "publishedAt", media: "coverImage" } },
});
