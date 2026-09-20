import { defineArrayMember, defineField, defineType } from "sanity";

// Image that always carries alt text (accessibility + SEO). Hotspot lets editors set the focal point.
export const imageWithAlt = defineType({
  name: "imageWithAlt",
  title: "Image",
  type: "image",
  options: { hotspot: true },
  fields: [
    defineField({
      name: "alt",
      title: "Alternative text",
      type: "string",
      description: "Describe the image for people using screen readers and for search engines.",
      validation: (rule) => rule.required().max(160),
    }),
  ],
});

// Rich text used for treatment descriptions, blog posts and generic pages.
export const blockContent = defineType({
  name: "blockContent",
  title: "Rich text",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      styles: [
        { title: "Normal", value: "normal" },
        { title: "Heading", value: "h2" },
        { title: "Sub-heading", value: "h3" },
        { title: "Quote", value: "blockquote" },
      ],
      lists: [
        { title: "Bullets", value: "bullet" },
        { title: "Numbered", value: "number" },
      ],
      marks: {
        decorators: [
          { title: "Bold", value: "strong" },
          { title: "Italic", value: "em" },
        ],
        annotations: [
          {
            name: "link",
            type: "object",
            title: "Link",
            fields: [
              defineField({
                name: "href",
                type: "url",
                title: "URL",
                validation: (rule) =>
                  rule.uri({ scheme: ["http", "https", "mailto", "tel"] }).required(),
              }),
            ],
          },
        ],
      },
    }),
    defineArrayMember({ type: "imageWithAlt" }),
  ],
});

export const seo = defineType({
  name: "seo",
  title: "Search & social (SEO)",
  type: "object",
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({
      name: "metaTitle",
      type: "string",
      title: "Meta title",
      description: "Shown in Google results. Around 50–60 characters. Leave empty to use the page title.",
      validation: (rule) => rule.max(70),
    }),
    defineField({
      name: "metaDescription",
      type: "text",
      rows: 3,
      title: "Meta description",
      description: "Shown under the title in Google results. Around 150 characters.",
      validation: (rule) => rule.max(180),
    }),
    defineField({
      name: "ogImage",
      type: "imageWithAlt",
      title: "Social sharing image",
      description: "Shown when the page is shared on WhatsApp, Facebook, etc. 1200×630 works best.",
    }),
  ],
});
