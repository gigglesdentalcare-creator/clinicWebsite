import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";

// Placeholder copy — replaced by CMS-driven content in Phase 3.
const steps = [
  {
    title: "Get in touch",
    body: "Call us, message on WhatsApp or send an appointment request. Whichever is easiest for you.",
  },
  {
    title: "Come and meet us",
    body: "A gentle check-up and a friendly chat, so you and your child know what to expect.",
  },
  {
    title: "Your care plan",
    body: "We explain the options in plain language, so you can decide what is right for your family.",
  },
] as const;

export default function VisitSteps() {
  return (
    <section className="bg-primary/8 py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary-text">Your first visit</p>
          <h2 className="mt-3 text-3xl font-semibold text-ink md:text-5xl">
            Simple, calm and unhurried
          </h2>
        </Reveal>

        <RevealGroup className="mt-10 grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <RevealItem key={step.title} className="flex gap-5">
              <span
                aria-hidden
                className="font-display text-5xl font-semibold leading-none text-primary/40"
              >
                {index + 1}
              </span>
              <div>
                <h3 className="text-xl font-semibold text-ink">{step.title}</h3>
                <p className="mt-2 leading-relaxed text-muted">{step.body}</p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
