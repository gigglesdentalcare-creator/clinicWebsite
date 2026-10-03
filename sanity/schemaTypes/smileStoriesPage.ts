import { ImagesIcon } from "@sanity/icons/Images";
import { defineField, defineType } from "sanity";

// Singleton: the title/intro text on /smile-stories. The cases themselves are separate
// `smileCase` documents (sanity/schemaTypes/smileCase.ts).
export const smileStoriesPage = defineType({
  name: "smileStoriesPage",
  title: "Smile stories page",
  type: "document",
  icon: ImagesIcon,
  fields: [
    defineField({ name: "title", type: "string", initialValue: "Smile Stories", validation: (r) => r.required() }),
    defineField({
      name: "intro",
      type: "text",
      rows: 3,
      initialValue: "Real results from our patients. Drag the slider to compare before and after.",
    }),
  ],
  preview: { prepare: () => ({ title: "Smile stories page" }) },
});
