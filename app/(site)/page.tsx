import AudienceSection from "@/components/sections/AudienceSection";
import Hero from "@/components/sections/Hero";
import type { HeroVideoSource } from "@/components/sections/HeroVideo";
import SocialSection from "@/components/sections/SocialSection";
import VisitSteps from "@/components/sections/VisitSteps";
import { getSiteInfo } from "@/lib/site-info";
import { fetchContent } from "@/sanity/lib/fetch";
import { heroVideoQuery } from "@/sanity/lib/queries";
import { tagsFor } from "@/sanity/lib/tags";

// The background video is optional and uploaded in Studio (Home page → Hero background video).
// No video, or Sanity unreachable, just means the plain hero — never a broken page.
async function getHeroVideo(): Promise<HeroVideoSource | null> {
  try {
    const data = await fetchContent({ query: heroVideoQuery, tags: tagsFor("homePage") });
    return data?.url ? { url: data.url, mimeType: data.mimeType } : null;
  } catch (error) {
    console.error("Could not load the hero video from Sanity.", error);
    return null;
  }
}

// Phase 1–2 placeholder home page. Real sections + CMS-driven content arrive in Phase 3.
export default async function Home() {
  const [info, video] = await Promise.all([getSiteInfo(), getHeroVideo()]);

  return (
    <>
      <Hero video={video} />
      <AudienceSection />
      <VisitSteps />
      <SocialSection info={info} />
    </>
  );
}
