import type { Metadata } from "next";
import { Reveal, RevealGroup } from "@/components/motion/Reveal";
import TreatmentCard from "@/components/treatments/TreatmentCard";
import { fetchContent } from "@/sanity/lib/fetch";
import { treatmentsQuery } from "@/sanity/lib/queries";
import { tagsFor } from "@/sanity/lib/tags";

export const metadata: Metadata = {
  title: "Treatments",
  description: "Dental treatments for kids and adults — from gentle first visits to implants, aligners and smile designing.",
};

// The home page's audience cards link to these anchors (/treatments#kids, /treatments#adults).
// A treatment marked "Kids & adults" in Studio appears in both sections.
const sections = [
  {
    id: "kids",
    title: "For kids",
    intro: "Gentle first visits, check-ups and cavity prevention, in a calm setting made for little ones.",
    audiences: ["kids", "both"],
  },
  {
    id: "adults",
    title: "For adults",
    intro: "Implants, smile designing, aligners, braces, root canal treatments, crowns and bridges, whitening and more.",
    audiences: ["adults", "both"],
  },
] as const;

async function getTreatments() {
  try {
    return (await fetchContent({ query: treatmentsQuery, tags: tagsFor("treatment") })) ?? [];
  } catch (error) {
    console.error("Could not load treatments from Sanity.", error);
    return [];
  }
}

export default async function TreatmentsPage() {
  const treatments = await getTreatments();

  return (
    <>
      <section className="mx-auto max-w-6xl px-5 pb-10 pt-14 md:pt-24">
        <Reveal>
          <h1 className="max-w-3xl text-4xl font-semibold leading-tight text-ink md:text-6xl">Treatments</h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">
            Care for every age, under one roof — for the little ones and the grown-ups.
          </p>
          <nav aria-label="Treatment sections" className="mt-8 flex flex-wrap gap-2">
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="rounded-full bg-primary-soft px-4 py-2 text-sm font-medium text-primary-dark transition-colors hover:bg-primary hover:text-white"
              >
                {section.title}
              </a>
            ))}
          </nav>
        </Reveal>
      </section>

      <div className="mx-auto flex max-w-6xl flex-col gap-16 px-5 pb-20 md:gap-20 md:pb-28">
        {sections.map((section) => {
          const items = treatments.filter(
            (treatment) => treatment.audience && (section.audiences as readonly string[]).includes(treatment.audience),
          );
          return (
            <section key={section.id} id={section.id} className="scroll-mt-24">
              <Reveal>
                <h2 className="text-2xl font-semibold text-ink md:text-4xl">{section.title}</h2>
                <p className="mt-2 max-w-2xl leading-relaxed text-muted">{section.intro}</p>
              </Reveal>
              {items.length > 0 ? (
                <RevealGroup className="mt-6 grid gap-5 md:mt-8 md:grid-cols-3">
                  {items.map((treatment) => (
                    <TreatmentCard key={treatment._id} treatment={treatment} />
                  ))}
                </RevealGroup>
              ) : (
                <p className="mt-6 rounded-card bg-primary/5 p-8 text-center text-muted">
                  No treatments listed yet — add a &ldquo;Treatment&rdquo; in the Studio.
                </p>
              )}
            </section>
          );
        })}
      </div>
    </>
  );
}
