import { Image } from "next-sanity/image";
import { RevealItem } from "@/components/motion/Reveal";
import { urlFor } from "@/sanity/lib/image";
import { treatmentCategories } from "@/lib/treatment-categories";
import type { TreatmentsQueryResult } from "@/sanity.types";

export type Treatment = TreatmentsQueryResult[number];

const categoryTitle = (value: Treatment["category"]) =>
  treatmentCategories.find((category) => category.value === value)?.title ?? null;

// One treatment on /treatments: optional photo (cropped to 3:2 around its focal point), then its
// category, title and summary. Not a link yet — there's no /treatments/[slug] page.
export default function TreatmentCard({ treatment }: { treatment: Treatment }) {
  const photo = treatment.image?.asset ? urlFor(treatment.image).width(900).height(600).fit("crop").auto("format").url() : null;
  const category = categoryTitle(treatment.category);

  return (
    <RevealItem className="flex h-full flex-col overflow-hidden rounded-card bg-primary/5 ring-1 ring-ink/5">
      {photo && (
        <Image
          src={photo}
          alt={treatment.image?.alt ?? ""}
          width={900}
          height={600}
          sizes="(min-width: 1152px) 360px, (min-width: 768px) 33vw, 100vw"
          className="aspect-[3/2] w-full object-cover"
        />
      )}
      <div className="flex flex-1 flex-col p-6">
        {category && <p className="text-sm font-semibold uppercase tracking-wider text-primary-text">{category}</p>}
        <h3 className="mt-1 text-xl font-semibold text-ink">{treatment.title}</h3>
        {treatment.summary && <p className="mt-2 leading-relaxed text-muted">{treatment.summary}</p>}
      </div>
    </RevealItem>
  );
}
