import AudienceSection from "@/components/sections/AudienceSection";
import Hero, { defaultHero, type HeroContent } from "@/components/sections/Hero";
import ProductsWeUse, { type ProductsWeUseContent } from "@/components/sections/ProductsWeUse";
import SmileStoriesPreview from "@/components/sections/SmileStoriesPreview";
import type { SmileCase } from "@/components/smile-stories/SmileCaseCard";
import SocialSection from "@/components/sections/SocialSection";
import VisitSteps from "@/components/sections/VisitSteps";
import { getSiteInfo } from "@/lib/site-info";
import { fetchContent } from "@/sanity/lib/fetch";
import { featuredSmileCasesQuery, heroQuery, productsWeUseQuery } from "@/sanity/lib/queries";
import { tagsFor } from "@/sanity/lib/tags";

// Headline, highlighted word, subheadline and the optional background video all come from the
// Home page document in Studio. Anything left empty — or Sanity being unreachable — falls back
// to the defaults, so the hero never renders broken.
async function getHero(): Promise<HeroContent> {
  try {
    const data = await fetchContent({ query: heroQuery, tags: tagsFor("homePage") });
    return {
      headline: data?.headline?.trim() || defaultHero.headline,
      // `null` means "not set" (use the default); an empty string means "no highlight".
      highlight: data?.highlight == null ? defaultHero.highlight : data.highlight.trim(),
      subheadline: data?.subheadline?.trim() || defaultHero.subheadline,
      video: data?.videoUrl ? { url: data.videoUrl, mimeType: data.videoMimeType } : null,
    };
  } catch (error) {
    console.error("Could not load the hero from Sanity, using defaults.", error);
    return defaultHero;
  }
}

// "Products we use" blocks from the Home page document. Returns null — hiding the section — when
// none have been added yet or Sanity can't be reached.
async function getProductsWeUse(): Promise<ProductsWeUseContent | null> {
  try {
    const data = await fetchContent({ query: productsWeUseQuery, tags: tagsFor("homePage") });
    const items = data?.items ?? [];
    if (items.length === 0) return null;
    return { title: data?.title?.trim() || "Products we use", intro: data?.intro?.trim() || null, items };
  } catch (error) {
    console.error("Could not load “Products we use” from Sanity.", error);
    return null;
  }
}

// Three before/after cases: the ones picked under Home page → Featured smile stories, topped up
// with the first cases by display order if fewer than three are picked (or none are).
async function getFeaturedSmileCases(): Promise<SmileCase[]> {
  try {
    const data = await fetchContent({ query: featuredSmileCasesQuery, tags: tagsFor("homePage", "smileCase") });
    const picked = data?.picked ?? [];
    const pickedIds = new Set(picked.map((smileCase) => smileCase._id));
    return [...picked, ...(data?.latest ?? []).filter((smileCase) => !pickedIds.has(smileCase._id))].slice(0, 3);
  } catch (error) {
    console.error("Could not load featured smile stories from Sanity.", error);
    return [];
  }
}

// Phase 1–2 placeholder home page. Real sections + CMS-driven content arrive in Phase 3.
export default async function Home() {
  const [info, hero, productsWeUse, smileCases] = await Promise.all([
    getSiteInfo(),
    getHero(),
    getProductsWeUse(),
    getFeaturedSmileCases(),
  ]);

  return (
    <>
      <Hero hero={hero} />
      <AudienceSection />
      <VisitSteps />
      {smileCases.length > 0 && <SmileStoriesPreview cases={smileCases} />}
      {productsWeUse && <ProductsWeUse content={productsWeUse} />}
      <SocialSection info={info} />
    </>
  );
}
