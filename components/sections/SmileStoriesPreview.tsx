import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Reveal, RevealGroup } from "@/components/motion/Reveal";
import SmileCaseCard, { type SmileCase } from "@/components/smile-stories/SmileCaseCard";

// Home page teaser: three before/after cases and a link to the full /smile-stories page.
export default function SmileStoriesPreview({ cases }: { cases: SmileCase[] }) {
  return (
    <section className="mx-auto max-w-6xl px-5 py-16 md:py-24">
      <Reveal className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary-text">Before &amp; after</p>
          <h2 className="mt-3 text-3xl font-semibold text-ink md:text-5xl">Smile stories</h2>
          <p className="mt-4 text-lg leading-relaxed text-muted">Real results from our patients. Drag the slider to compare.</p>
        </div>
        <Link
          href="/smile-stories"
          className="group hidden shrink-0 items-center gap-2 text-sm font-semibold text-primary-text md:inline-flex"
        >
          See all smile stories
          <ArrowRight size={16} aria-hidden className="transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </Reveal>

      <RevealGroup className="mt-10 grid gap-x-6 gap-y-12 md:grid-cols-3">
        {cases.map((smileCase) => (
          <SmileCaseCard key={smileCase._id} smileCase={smileCase} sizes="(min-width: 1152px) 360px, (min-width: 768px) 33vw, 100vw" />
        ))}
      </RevealGroup>

      <div className="mt-10 flex justify-center">
        <Link
          href="/smile-stories"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-primary-dark"
        >
          See all smile stories
          <ArrowRight size={16} aria-hidden />
        </Link>
      </div>
    </section>
  );
}
