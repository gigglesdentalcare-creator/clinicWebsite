import { StarIcon } from "@sanity/icons/Star";
import { defineField, defineType } from "sanity";

// Singleton: the title/intro text on /recommendations. The products themselves are separate
// `recommendedProduct` documents (sanity/schemaTypes/recommendedProduct.ts).
export const recommendationsPage = defineType({
  name: "recommendationsPage",
  title: "Recommendations page",
  type: "document",
  icon: StarIcon,
  fields: [
    defineField({ name: "title", type: "string", initialValue: "Recommended Products", validation: (r) => r.required() }),
    defineField({
      name: "intro",
      type: "text",
      rows: 3,
      initialValue: "A few products our dentists trust and recommend to patients.",
    }),
  ],
  preview: { prepare: () => ({ title: "Recommendations page" }) },
});
