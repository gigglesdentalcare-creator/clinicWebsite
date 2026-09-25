import AudienceSection from "@/components/sections/AudienceSection";
import Hero, { defaultHero, type HeroContent } from "@/components/sections/Hero";
import SocialSection from "@/components/sections/SocialSection";
import VisitSteps from "@/components/sections/VisitSteps";
import { getSiteInfo } from "@/lib/site-info";
import { fetchContent } from "@/sanity/lib/fetch";
import { heroQuery } from "@/sanity/lib/queries";
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

// Phase 1–2 placeholder home page. Real sections + CMS-driven content arrive in Phase 3.
export default async function Home() {
  const [info, hero] = await Promise.all([getSiteInfo(), getHero()]);

  return (
    <>
      <Hero hero={hero} />
      <AudienceSection />
      <VisitSteps />
      <SocialSection info={info} />
    </>
  );
}
