import Link from "next/link";
import { site, whatsappLink } from "@/lib/site";

// Phase 1 placeholder hero. Real sections + CMS-driven content arrive in Phases 2–3.
export default function Home() {
  return (
    <section className="mx-auto max-w-6xl px-5 pb-10 pt-14 md:pt-24">
      <p className="inline-block rounded-full bg-mint px-4 py-1.5 text-sm font-medium text-primary-dark">
        Sri Ram Nagar, Kondapur · Hyderabad
      </p>
      <h1 className="mt-6 max-w-3xl text-5xl font-semibold leading-[1.05] text-ink md:text-7xl">
        Smiles that start with a <span className="text-primary">giggle</span>.
      </h1>
      <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
        {site.description} From a child&apos;s first check-up to a grandparent&apos;s dentures — one
        friendly clinic for the whole family.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/book"
          className="rounded-full bg-primary px-7 py-3.5 font-semibold text-white transition-colors hover:bg-primary-dark"
        >
          Book an appointment
        </Link>
        <a
          href={whatsappLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-sun px-7 py-3.5 font-semibold text-ink transition-colors hover:brightness-95"
        >
          Chat on WhatsApp
        </a>
      </div>
    </section>
  );
}
