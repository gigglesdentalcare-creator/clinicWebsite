import { defineQuery } from "next-sanity";

const treatmentCard = /* groq */ `{
  _id, title, "slug": slug.current, audience, category, summary, image
}`;

export const siteSettingsQuery = defineQuery(`*[_type == "siteSettings"][0]{
  name, tagline, phone, whatsapp, email,
  "logo": logo{
    alt,
    "url": asset->url,
    "width": asset->metadata.dimensions.width,
    "height": asset->metadata.dimensions.height
  },
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
  _id, name, "slug": slug.current, qualifications, specialisation, registrationNumber, bio,
  "photo": photo{
    alt,
    "url": asset->url,
    "width": asset->metadata.dimensions.width,
    "height": asset->metadata.dimensions.height
  }
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

export const heroQuery = defineQuery(`*[_type == "homePage"][0]{
  "headline": heroHeadline,
  "highlight": heroHighlight,
  "subheadline": heroSubheadline,
  "videoUrl": select(heroVideo.asset->size > 0 => heroVideo.asset->url),
  "videoMimeType": select(heroVideo.asset->size > 0 => heroVideo.asset->mimeType)
}`);

export const productsWeUseQuery = defineQuery(`*[_type == "homePage"][0]{
  "title": productsWeUseTitle,
  "intro": productsWeUseIntro,
  "items": productsWeUse[defined(name)]{
    _key, name, text,
    "image": image{
      "url": asset->url,
      "width": asset->metadata.dimensions.width,
      "height": asset->metadata.dimensions.height
    }
  }
}`);

export const recommendationsPageQuery =defineQuery(`*[_type == "recommendationsPage"][0]{ title, intro }`);

// Only products with a link, name and photo — skips one an editor is still filling in.
export const productCategoriesQuery = defineQuery(`*[_type == "productCategory"] | order(order asc, title asc){
  _id, title, description,
  "products": products[defined(link) && defined(name) && defined(image.asset)]{
    _key, name, link, note,
    "image": image{
      "url": asset->url,
      "width": asset->metadata.dimensions.width,
      "height": asset->metadata.dimensions.height
    }
  }
}`);

// Before/after cases. Only ones with patient consent and both photos are ever returned.
const smileCaseFields = `{
  _id, title, treatment, duration, description,
  "before": beforeImage{ alt, asset, hotspot, crop },
  "after": afterImage{ alt, asset, hotspot, crop }
}`;

export const smileStoriesPageQuery = defineQuery(`*[_type == "smileStoriesPage"][0]{ title, intro }`);

export const smileCasesQuery = defineQuery(`*[_type == "smileCase" && consent == true && defined(beforeImage.asset) && defined(afterImage.asset)]
  | order(order asc, _createdAt desc) ${smileCaseFields}`);

// Home page: the hand-picked cases, or else the first three by display order.
export const featuredSmileCasesQuery = defineQuery(`{
  "picked": *[_type == "homePage"][0].featuredSmileStories[]->[consent == true && defined(beforeImage.asset) && defined(afterImage.asset)] ${smileCaseFields},
  "latest": *[_type == "smileCase" && consent == true && defined(beforeImage.asset) && defined(afterImage.asset)]
    | order(order asc, _createdAt desc)[0...3] ${smileCaseFields}
}`);
