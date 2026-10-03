import { RevealItem } from "@/components/motion/Reveal";
import { urlFor } from "@/sanity/lib/image";
import type { SmileCasesQueryResult } from "@/sanity.types";
import BeforeAfterSlider from "./BeforeAfterSlider";

export type SmileCase = SmileCasesQueryResult[number];

// Both photos are cropped to the same 4:3 frame (respecting each photo's focal point set in
// Studio) so the before and after line up under the slider.
const photoUrl = (image: SmileCase["before"]) =>
  image?.asset ? urlFor(image).width(1200).height(900).fit("crop").auto("format").url() : null;

// One before/after case: the comparison slider, then its title, treatment and notes.
export default function SmileCaseCard({ smileCase, sizes }: { smileCase: SmileCase; sizes: string }) {
  const before = photoUrl(smileCase.before);
  const after = photoUrl(smileCase.after);
  if (!before || !after) return null;
  const title = smileCase.title ?? "";
  const meta = [smileCase.treatment, smileCase.duration].filter(Boolean);

  return (
    <RevealItem className="flex flex-col">
      <BeforeAfterSlider
        before={{ src: before, alt: smileCase.before?.alt ?? `Before: ${title}` }}
        after={{ src: after, alt: smileCase.after?.alt ?? `After: ${title}` }}
        sizes={sizes}
      />
      <div className="mt-4">
        {meta.length > 0 && (
          <p className="text-sm font-semibold uppercase tracking-wider text-primary-text">{meta.join(" · ")}</p>
        )}
        <h3 className="mt-1 text-xl font-semibold text-ink">{title}</h3>
        {smileCase.description && <p className="mt-2 leading-relaxed text-muted">{smileCase.description}</p>}
      </div>
    </RevealItem>
  );
}
