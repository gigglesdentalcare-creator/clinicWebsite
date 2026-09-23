import { MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { Image } from "next-sanity/image";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { navLinks, type SiteInfo } from "@/lib/site";

export default function Footer({ info }: { info: SiteInfo }) {
  return (
    // bg-navy (not the adaptive bg-ink): the footer stays a dark band in both light and dark
    // mode — it should not flip to a light background when the site theme is dark.
    <footer className="mt-24 bg-navy text-white/80">
      <RevealGroup className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-3">
        <RevealItem>
          {info.logo && (
            // White badge: the logo is drawn for light backgrounds and would vanish on the dark footer.
            <span className="mb-4 inline-flex rounded-2xl bg-white p-2">
              <Image
                src={info.logo.url}
                alt=""
                width={info.logo.width}
                height={info.logo.height}
                sizes="64px"
                className="h-12 w-auto"
              />
            </span>
          )}
          <p className="font-display text-2xl font-semibold text-white">{info.name}</p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed">{info.tagline}. Gentle care for kids, teens and adults under one roof.</p>
        </RevealItem>

        <RevealItem>
        <nav aria-label="Footer">
          <p className="text-sm font-semibold uppercase tracking-wider text-accent">Explore</p>
          <ul className="mt-4 space-y-2 text-sm">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        </RevealItem>

        <RevealItem>
          <p className="text-sm font-semibold uppercase tracking-wider text-accent">Visit us</p>
          <address className="mt-4 space-y-3 text-sm not-italic">
            <p className="flex gap-2">
              <MapPin size={18} className="mt-0.5 shrink-0" aria-hidden />
              {info.address.line1}, {info.address.city}, {info.address.region}
            </p>
            <p className="flex gap-2">
              <Phone size={18} className="mt-0.5 shrink-0" aria-hidden />
              <a href={`tel:${info.phone}`} className="hover:text-white">
                {info.phoneDisplay}
              </a>
            </p>
          </address>
        </RevealItem>
      </RevealGroup>
      <div className="border-t border-white/10 px-5 py-5 text-center text-xs text-white/60">
        <p>© {new Date().getFullYear()} {info.name}. All rights reserved.</p>
        <p className="mt-1">
          Site developed and maintained by{" "}
          <a
            href="https://github.com/anand404ankit"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-white"
          >
            Ankit Anand
          </a>
          .
        </p>
      </div>
    </footer>
  );
}
