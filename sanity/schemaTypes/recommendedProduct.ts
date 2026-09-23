import { BasketIcon } from "@sanity/icons/Basket";
import { defineField, defineType } from "sanity";

// A product the clinic recommends (toothpaste, a kids' toothbrush, mouthwash, etc.), shown on
// the public /recommendations page. `link` points off-site to where it can be bought.
export const recommendedProduct = defineType({
  name: "recommendedProduct",
  title: "Recommended product",
  type: "document",
  icon: BasketIcon,
  fields: [
    defineField({ name: "name", title: "Product name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "brand", type: "string" }),
    defineField({ name: "image", type: "imageWithAlt", validation: (r) => r.required() }),
    defineField({
      name: "description",
      type: "text",
      rows: 3,
      description: "Why the clinic recommends it, in a sentence or two.",
      validation: (r) => r.required().max(300),
    }),
    defineField({
      name: "link",
      title: "Where to buy / learn more",
      type: "url",
      validation: (r) => r.required().uri({ scheme: ["http", "https"] }),
    }),
    defineField({ name: "order", type: "number", description: "Lower numbers appear first.", initialValue: 100 }),
  ],
  orderings: [
    { title: "Display order", name: "order", by: [{ field: "order", direction: "asc" }, { field: "name", direction: "asc" }] },
  ],
  preview: {
    select: { title: "name", subtitle: "brand", media: "image" },
  },
});
