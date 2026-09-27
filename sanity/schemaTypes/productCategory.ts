import { BasketIcon } from "@sanity/icons/Basket";
import { defineArrayMember, defineField, defineType } from "sanity";
import ProductLinkInput from "../components/ProductLinkInput";

// A group of recommended products on /recommendations (e.g. "Toothpaste", "Kids' brushes").
// Editors paste a shop link per product; the title and photo are fetched from the link
// (see sanity/components/ProductLinkInput.tsx) and can be edited afterwards.
export const productCategory = defineType({
  name: "productCategory",
  title: "Product category",
  type: "document",
  icon: BasketIcon,
  fields: [
    defineField({ name: "title", type: "string", description: "e.g. Toothpaste", validation: (r) => r.required() }),
    defineField({
      name: "description",
      type: "text",
      rows: 2,
      description: "Optional line shown under the category title.",
    }),
    defineField({
      name: "products",
      type: "array",
      of: [
        defineArrayMember({
          name: "productLink",
          title: "Product",
          type: "object",
          components: { input: ProductLinkInput },
          fields: [
            defineField({
              name: "link",
              title: "Product link",
              type: "url",
              description: "Paste the Amazon (or any shop) link — the name and photo fill in automatically.",
              validation: (r) => r.required().uri({ scheme: ["http", "https"] }),
            }),
            defineField({
              name: "name",
              type: "string",
              description: "Filled in from the link. Shorten it if it's long.",
              validation: (r) => r.required(),
            }),
            defineField({
              name: "image",
              title: "Photo",
              type: "image",
              description: "Filled in from the link.",
              validation: (r) => r.required(),
            }),
            defineField({
              name: "note",
              title: "Why we recommend it",
              type: "text",
              rows: 2,
              description: "Optional, a sentence or two.",
              validation: (r) => r.max(300),
            }),
          ],
          preview: {
            select: { title: "name", subtitle: "link", media: "image" },
            prepare: ({ title, subtitle, media }) => ({ title: title || subtitle || "New product", subtitle, media }),
          },
        }),
      ],
    }),
    defineField({ name: "order", type: "number", description: "Lower numbers appear first.", initialValue: 100 }),
  ],
  orderings: [
    { title: "Display order", name: "order", by: [{ field: "order", direction: "asc" }, { field: "title", direction: "asc" }] },
  ],
  preview: {
    select: { title: "title", products: "products", media: "products.0.image" },
    prepare: ({ title, products, media }) => {
      const count = Array.isArray(products) ? products.length : 0;
      return { title, subtitle: `${count} product${count === 1 ? "" : "s"}`, media };
    },
  },
});
