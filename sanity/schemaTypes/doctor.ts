import { UserIcon } from "@sanity/icons/User";
import { defineField, defineType } from "sanity";

export const doctor = defineType({
  name: "doctor",
  title: "Doctor",
  type: "document",
  icon: UserIcon,
  fields: [
    defineField({ name: "name", type: "string", description: "Include the title, e.g. “Dr. Firstname Lastname”.", validation: (r) => r.required() }),
    defineField({ name: "slug", type: "slug", options: { source: "name", maxLength: 96 }, validation: (r) => r.required() }),
    defineField({ name: "qualifications", type: "string", description: "e.g. BDS, MDS (Pedodontics)" }),
    defineField({ name: "specialisation", type: "string", description: "e.g. Paediatric dentist" }),
    defineField({ name: "registrationNumber", title: "Dental council registration no.", type: "string" }),
    defineField({ name: "photo", type: "imageWithAlt" }),
    defineField({ name: "bio", type: "blockContent" }),
    defineField({ name: "order", type: "number", description: "Lower numbers appear first.", initialValue: 100 }),
  ],
  orderings: [{ title: "Display order", name: "order", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "name", subtitle: "specialisation", media: "photo" } },
});
