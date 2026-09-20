import { CommentIcon } from "@sanity/icons/Comment";
import { defineField, defineType } from "sanity";

export const testimonial = defineType({
  name: "testimonial",
  title: "Testimonial",
  type: "document",
  icon: CommentIcon,
  fields: [
    defineField({ name: "patientName", title: "Patient name", type: "string", description: "First name (and initial) only, e.g. “Priya S.”", validation: (r) => r.required() }),
    defineField({ name: "quote", type: "text", rows: 4, validation: (r) => r.required().max(500) }),
    defineField({ name: "treatment", type: "reference", to: [{ type: "treatment" }] }),
    defineField({ name: "rating", type: "number", options: { list: [5, 4, 3, 2, 1] }, initialValue: 5 }),
    defineField({ name: "source", type: "string", options: { list: [{ title: "Google review", value: "google" }, { title: "Told to us directly", value: "direct" }], layout: "radio" }, initialValue: "direct" }),
    defineField({
      name: "consent",
      title: "Patient has agreed to this being published",
      type: "boolean",
      initialValue: false,
      validation: (r) => r.custom((value) => value === true || "Only publish testimonials with the patient's consent."),
    }),
  ],
  preview: { select: { title: "patientName", subtitle: "quote" } },
});
