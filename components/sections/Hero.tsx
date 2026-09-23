import Link from "next/link";
import { site } from "@/lib/site";
import HeroVideo, { type HeroVideoSource } from "./HeroVideo";

// Home page hero. CSS entrance animation (starts on first paint, staggered by delay). When the
// clinic has uploaded a background video in Studio it plays behind the whole section, full
// width; otherwise this is just the plain background.
export default function Hero({ video }: { video: HeroVideoSource | null }) {
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
          Smile that starts with <span className="text-primary-text">Giggles</span>.
        </h1>
        <p className="animate-fade-up mt-6 max-w-xl text-lg leading-relaxed text-muted [animation-delay:240ms]">
          {site.description} From a child&apos;s first check-up to a grandparent&apos;s dentures — one
          friendly clinic for the whole family.
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
