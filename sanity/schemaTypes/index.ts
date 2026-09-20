import type { SchemaTypeDefinition } from "sanity";
import { doctor } from "./doctor";
import { faq } from "./faq";
import { galleryItem } from "./galleryItem";
import { homePage } from "./homePage";
import { blockContent, imageWithAlt, seo } from "./objects";
import { page } from "./page";
import { post } from "./post";
import { siteSettings } from "./siteSettings";
import { testimonial } from "./testimonial";
import { treatment } from "./treatment";

export const schemaTypes: SchemaTypeDefinition[] = [
  // documents
  siteSettings,
  homePage,
  treatment,
  doctor,
  testimonial,
  galleryItem,
  faq,
  post,
  page,
  // shared objects
  imageWithAlt,
  blockContent,
  seo,
];

// Documents that exist exactly once. Studio shows them as single items (see structure.ts).
export const singletonTypes = ["siteSettings", "homePage"];
