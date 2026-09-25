import Link from "next/link";
import { site } from "@/lib/site";
import HeroVideo, { type HeroVideoSource } from "./HeroVideo";

export type HeroContent = {
  headline: string;
  /** Word/phrase from the headline shown in blue; empty for none. */
  highlight: string;
  subheadline: string;
  video: HeroVideoSource | null;
};

// What the hero shows until the clinic edits the Home page in Studio.
export const defaultHero: HeroContent = {
  headline: "Smiles that start with Giggles",
  highlight: "Giggles",
  subheadline: `${site.description} From a child's first check-up to a grandparent's dentures — one friendly clinic for the whole family.`,
  video: null,
};

// Shows the headline as typed, with the first occurrence of `highlight` (any capitalisation) in
// blue. If the phrase isn't in the headline there's simply no highlight.
function renderHeadline(headline: string, highlight: string) {
  const start = highlight ? headline.toLowerCase().indexOf(highlight.toLowerCase()) : -1;
  if (start < 0) return headline;
  const end = start + highlight.length;
  return (
    <>
      {headline.slice(0, start)}
      <span className="text-primary-text">{headline.slice(start, end)}</span>
      {headline.slice(end)}
    </>
  );
}

// Home page hero. CSS entrance animation (starts on first paint, staggered by delay). When the
// clinic has uploaded a background video in Studio it plays behind the whole section, full
// width; otherwise this is just the plain background.
export default function Hero({ hero }: { hero: HeroContent }) {
  const { headline, highlight, subheadline, video } = hero;
  return (
    <section className="relative isolate overflow-hidden">
      {video && <HeroVideo video={video} />}
      <div
        className={`mx-auto max-w-6xl px-5 ${video ? "pb-16 pt-16 md:pb-28 md:pt-32" : "pb-10 pt-14 md:pt-24"}`}
      >
        {/* bg-primary-soft: a fixed pale-blue "badge", not the adaptive card tones used further
            down the page — this one is meant to read as a brand sticker in both themes. */}
        <p className="animate-fade-up inline-block rounded-full bg-primary-soft px-4 py-1.5 text-sm font-medium text-primary-dark">
          Sri Ram Nagar, Kondapur · Hyderabad
        </p>
        <h1 className="animate-fade-up mt-6 max-w-3xl text-5xl font-semibold leading-[1.05] text-ink [animation-delay:120ms] md:text-7xl">
          {renderHeadline(headline, highlight)}
        </h1>
        <p className="animate-fade-up mt-6 max-w-xl whitespace-pre-line text-lg leading-relaxed text-muted [animation-delay:240ms]">
          {subheadline}
        </p>
        <div className="animate-fade-up mt-8 flex flex-wrap gap-3 [animation-delay:360ms]">
          <Link
            href="/contact"
            className="rounded-full bg-primary px-7 py-3.5 font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-primary-dark"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  );
}
