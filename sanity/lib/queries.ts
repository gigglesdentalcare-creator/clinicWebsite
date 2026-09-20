import { defineQuery } from "next-sanity";

const treatmentCard = /* groq */ `{
  _id, title, "slug": slug.current, audience, category, summary, image
}`;

export const siteSettingsQuery = defineQuery(`*[_type == "siteSettings"][0]{
  name, tagline, phone, whatsapp, email,
  addressLine1, city, region, postalCode, mapsUrl, googleReviewUrl,
  hours, socialLinks
}`);

export const homePageQuery = defineQuery(`*[_type == "homePage"][0]{
  heroHeadline, heroSubheadline, heroImage, trustStats,
  featuredTreatments[]->${treatmentCard},
  featuredDoctors[]->{ _id, name, "slug": slug.current, qualifications, specialisation, photo },
  featuredTestimonials[]->{ _id, patientName, quote, rating, source }
}`);

export const treatmentsQuery = defineQuery(`*[_type == "treatment" && defined(slug.current)]
  | order(order asc, title asc) ${treatmentCard}`);

export const treatmentBySlugQuery = defineQuery(`*[_type == "treatment" && slug.current == $slug][0]{
  _id, title, "slug": slug.current, audience, category, summary, image, body, faqs, seo,
  related[]->${treatmentCard}
}`);

export const treatmentSlugsQuery = defineQuery(`*[_type == "treatment" && defined(slug.current)]{ "slug": slug.current }`);

export const doctorsQuery = defineQuery(`*[_type == "doctor" && defined(slug.current)] | order(order asc, name asc){
  _id, name, "slug": slug.current, qualifications, specialisation, registrationNumber, photo, bio
}`);

export const faqsQuery = defineQuery(`*[_type == "faq"] | order(order asc){ _id, question, answer, group }`);

export const testimonialsQuery = defineQuery(`*[_type == "testimonial" && consent == true]
  | order(_createdAt desc){ _id, patientName, quote, rating, source, "treatment": treatment->title }`);

export const galleryQuery = defineQuery(`*[_type == "galleryItem" && (kind != "beforeAfter" || consent == true)]
  | order(_createdAt desc){
    _id, title, kind, image, beforeImage, afterImage, caption, "treatment": treatment->title
  }`);

export const postsQuery = defineQuery(`*[_type == "post" && defined(slug.current)] | order(publishedAt desc){
  _id, title, "slug": slug.current, excerpt, coverImage, publishedAt, "author": author->name
}`);

export const postBySlugQuery = defineQuery(`*[_type == "post" && slug.current == $slug][0]{
  _id, title, "slug": slug.current, excerpt, coverImage, body, publishedAt, seo,
  "author": author->{ name, qualifications, photo }
}`);

export const postSlugsQuery = defineQuery(`*[_type == "post" && defined(slug.current)]{ "slug": slug.current }`);

export const pageBySlugQuery = defineQuery(`*[_type == "page" && slug.current == $slug][0]{
  _id, title, "slug": slug.current, body, seo
}`);
