import { ArrowRight, Baby, User, Users } from "lucide-react";
import Link from "next/link";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";

// Placeholder copy — replaced by CMS-driven content in Phase 3.
const audiences = [
  {
    title: "Kids",
    icon: Baby,
    body: "Gentle first visits, check-ups and cavity prevention, in a calm setting made for little ones.",
    href: "/kids-dentistry",
    tone: "bg-sun/25",
  },
  {
    title: "Adults",
    icon: User,
    body: "Check-ups, fillings, root canals, braces, whitening and more, for every stage of life.",
    href: "/treatments",
    tone: "bg-mint",
  },
  {
    title: "Whole family",
    icon: Users,
    body: "Book everyone in together. One clinic and one friendly team who get to know the whole family.",
    href: "/book",
    tone: "bg-coral/15",
  },
] as const;

export default function AudienceSection() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-16 md:py-24">
      <Reveal className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-wider text-primary">Care for every age</p>
        <h2 className="mt-3 text-3xl font-semibold text-ink md:text-5xl">
          One clinic for the whole family
        </h2>
      </Reveal>

      <RevealGroup className="mt-10 grid gap-5 md:grid-cols-3">
        {audiences.map(({ title, icon: Icon, body, href, tone }) => (
          <RevealItem key={title}>
            <Link
              href={href}
              className={`group flex h-full flex-col rounded-card p-7 transition duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-ink/10 ${tone}`}
            >
              <span className="inline-flex size-12 items-center justify-center rounded-full bg-white/80 text-ink">
                <Icon size={24} aria-hidden />
              </span>
              <h3 className="mt-6 text-2xl font-semibold text-ink">{title}</h3>
              <p className="mt-2 flex-1 leading-relaxed text-muted">{body}</p>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-ink">
                Learn more
                <ArrowRight
                  size={16}
                  aria-hidden
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </span>
            </Link>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}
