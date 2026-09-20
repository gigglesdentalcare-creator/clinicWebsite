import { HelpCircleIcon } from "@sanity/icons/HelpCircle";
import { defineField, defineType } from "sanity";

export const faq = defineType({
  name: "faq",
  title: "FAQ",
  type: "document",
  icon: HelpCircleIcon,
  fields: [
    defineField({ name: "question", type: "string", validation: (r) => r.required() }),
    defineField({ name: "answer", type: "text", rows: 5, validation: (r) => r.required() }),
    defineField({
      name: "group",
      type: "string",
      options: { list: [{ title: "General", value: "general" }, { title: "Kids", value: "kids" }, { title: "Adults", value: "adults" }], layout: "radio" },
      initialValue: "general",
    }),
    defineField({ name: "order", type: "number", initialValue: 100 }),
  ],
  orderings: [{ title: "Display order", name: "order", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "question", subtitle: "group" } },
});
