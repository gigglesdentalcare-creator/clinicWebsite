import { Clock, Link2, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { FacebookIcon, InstagramIcon } from "@/components/icons/SocialIcons";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { site, whatsappLink, type SocialLink } from "@/lib/site";
import { getSiteInfo } from "@/lib/site-info";

export const metadata: Metadata = {
  title: "Contact Us",
  description: `Call, WhatsApp, email or visit ${site.name} in ${site.address.city}.`,
};

type SocialIconComponent = (props: { size?: number; className?: string }) => ReactNode;

const socialIcons: Record<SocialLink["platform"], SocialIconComponent> = {
  Instagram: InstagramIcon,
  Facebook: FacebookIcon,
  // lucide dropped brand icons for these platforms; a generic "link" icon still gets the point
  // across, since each one is shown with its platform name as well, not the icon alone.
  LinkedIn: Link2,
  YouTube: Link2,
  X: Link2,
};

export default async function ContactPage() {
  const info = await getSiteInfo();
  const addressLines = [info.address.line1, `${info.address.city}, ${info.address.region}`, info.address.postalCode]
    .filter(Boolean)
    .join("\n");

  return (
    <>
      <section className="mx-auto max-w-6xl px-5 pb-10 pt-14 md:pt-24">
        <Reveal>
          <h1 className="max-w-2xl text-4xl font-semibold leading-tight text-ink md:text-6xl">Get in Touch</h1>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted">
            Call, WhatsApp, email or visit us — whichever is easiest for you and your family.
          </p>
        </Reveal>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-20 md:pb-28">
        <RevealGroup className="grid gap-5 md:grid-cols-2">
          <RevealItem className="flex flex-col gap-5 rounded-card bg-primary/5 p-7 md:p-8">
            <div className="flex gap-4">
              <MapPin size={22} className="mt-0.5 shrink-0 text-primary-text" aria-hidden />
              <div>
                <p className="font-semibold text-ink">Address</p>
                <p className="mt-1 whitespace-pre-line leading-relaxed text-muted">{addressLines}</p>
                <a
                  href={info.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block text-sm font-semibold text-primary-text hover:underline"
                >
                  Get directions
                </a>
              </div>
            </div>

            <div className="flex gap-4">
              <Phone size={22} className="mt-0.5 shrink-0 text-primary-text" aria-hidden />
              <div>
                <p className="font-semibold text-ink">Call us</p>
                <a href={`tel:${info.phone}`} className="mt-1 block leading-relaxed text-muted hover:text-ink">
                  {info.phoneDisplay}
                </a>
              </div>
            </div>

            <div className="flex gap-4">
              <MessageCircle size={22} className="mt-0.5 shrink-0 text-primary-text" aria-hidden />
              <div>
                <p className="font-semibold text-ink">WhatsApp</p>
                <a
                  href={whatsappLink(info.whatsapp)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 block leading-relaxed text-muted hover:text-ink"
                >
                  Chat with us
                </a>
              </div>
            </div>

            {info.email && (
              <div className="flex gap-4">
                <Mail size={22} className="mt-0.5 shrink-0 text-primary-text" aria-hidden />
                <div>
                  <p className="font-semibold text-ink">Email</p>
                  <a href={`mailto:${info.email}`} className="mt-1 block leading-relaxed text-muted hover:text-ink">
                    {info.email}
                  </a>
                </div>
              </div>
            )}

            {info.socialLinks.length > 0 && (
              <div className="flex gap-4">
                <span className="mt-0.5 flex size-[22px] shrink-0 items-center justify-center text-primary-text" aria-hidden>
                  <Link2 size={20} />
                </span>
                <div>
                  <p className="font-semibold text-ink">Follow us</p>
                  <ul className="mt-2 flex flex-wrap gap-3">
                    {info.socialLinks.map((link) => {
                      const Icon = socialIcons[link.platform];
                      return (
                        <li key={link.platform}>
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-sm font-medium text-ink transition hover:bg-primary/10"
                          >
                            <Icon size={16} />
                            {link.platform}
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            )}
          </RevealItem>

          <RevealItem className="flex flex-col gap-6 rounded-card bg-ink/5 p-7 md:p-8">
            {info.hours.length > 0 && (
              <div className="flex gap-4">
                <Clock size={22} className="mt-0.5 shrink-0 text-primary-text" aria-hidden />
                <div className="flex-1">
                  <p className="font-semibold text-ink">Opening hours</p>
                  <dl className="mt-2 divide-y divide-ink/10 text-sm">
                    {info.hours.map((entry) => (
                      <div key={entry.day} className="flex justify-between gap-4 py-1.5">
                        <dt className="text-muted">{entry.day}</dt>
                        <dd className="font-medium text-ink">
                          {entry.closed ? "Closed" : `${entry.opens ?? "?"} – ${entry.closes ?? "?"}`}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            )}

            <div className="mt-auto flex flex-wrap gap-3">
              <Link
                href="/book"
                className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-primary-dark"
              >
                Book an appointment
              </Link>
              <a
                href={whatsappLink(info.whatsapp)}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-navy transition duration-300 hover:-translate-y-0.5 hover:brightness-95"
              >
                Chat on WhatsApp
              </a>
            </div>
          </RevealItem>
        </RevealGroup>
      </section>
    </>
  );
}
