import Link from "next/link";
import AudienceSection from "@/components/sections/AudienceSection";
import VisitSteps from "@/components/sections/VisitSteps";
import { site, whatsappLink } from "@/lib/site";
import { getSiteInfo } from "@/lib/site-info";

// Phase 1–2 placeholder home page. Real sections + CMS-driven content arrive in Phase 3.
export default async function Home() {
  const info = await getSiteInfo();

  return (
    <>
      {/* Hero: CSS entrance animation (starts on first paint, staggered by delay). */}
      <section className="mx-auto max-w-6xl px-5 pb-10 pt-14 md:pt-24">
        <p className="animate-fade-up inline-block rounded-full bg-mint px-4 py-1.5 text-sm font-medium text-primary-dark">
          Sri Ram Nagar, Kondapur · Hyderabad
        </p>
        <h1 className="animate-fade-up mt-6 max-w-3xl text-5xl font-semibold leading-[1.05] text-ink [animation-delay:120ms] md:text-7xl">
          Smiles that start with a <span className="text-primary">giggle</span>.
        </h1>
        <p className="animate-fade-up mt-6 max-w-xl text-lg leading-relaxed text-muted [animation-delay:240ms]">
          {site.description} From a child&apos;s first check-up to a grandparent&apos;s dentures — one
          friendly clinic for the whole family.
        </p>
        <div className="animate-fade-up mt-8 flex flex-wrap gap-3 [animation-delay:360ms]">
          <Link
            href="/book"
            className="rounded-full bg-primary px-7 py-3.5 font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-primary-dark"
          >
            Book an appointment
          </Link>
          <a
            href={whatsappLink(info.whatsapp)}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-sun px-7 py-3.5 font-semibold text-ink transition duration-300 hover:-translate-y-0.5 hover:brightness-95"
          >
            Chat on WhatsApp
          </a>
        </div>
      </section>

      <AudienceSection />
      <VisitSteps />
    </>
  );
}
