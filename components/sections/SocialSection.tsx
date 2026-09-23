import { Reveal } from "@/components/motion/Reveal";
import SocialLinks from "@/components/social/SocialLinks";
import type { SiteInfo } from "@/lib/site";

// Home page: the clinic's Google listing, WhatsApp and social profiles as large icons.
export default function SocialSection({ info }: { info: SiteInfo }) {
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-5 text-center">
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-wider text-primary-text">Stay in touch</p>
          <h2 className="mt-3 text-3xl font-semibold text-ink md:text-5xl">Find us online</h2>
          <p className="mx-auto mt-4 max-w-xl leading-relaxed text-muted">
            Read our Google reviews, message us on WhatsApp, or follow along for smile tips and clinic news.
          </p>
        </Reveal>
        <SocialLinks info={info} size="lg" showLabels className="mt-10 justify-center gap-6 md:gap-10" />
      </div>
    </section>
  );
}
