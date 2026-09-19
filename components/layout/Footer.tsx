import { MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { navLinks, site } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="mt-24 bg-ink text-white/80">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-3">
        <div>
          <p className="font-display text-2xl font-semibold text-white">{site.name}</p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed">{site.tagline}. Gentle care for kids, teens and adults under one roof.</p>
        </div>

        <nav aria-label="Footer">
          <p className="text-sm font-semibold uppercase tracking-wider text-sun">Explore</p>
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

        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-sun">Visit us</p>
          <address className="mt-4 space-y-3 text-sm not-italic">
            <p className="flex gap-2">
              <MapPin size={18} className="mt-0.5 shrink-0" aria-hidden />
              {site.address.line1}, {site.address.city}, {site.address.region}
            </p>
            <p className="flex gap-2">
              <Phone size={18} className="mt-0.5 shrink-0" aria-hidden />
              <a href={`tel:${site.phone}`} className="hover:text-white">
                {site.phoneDisplay}
              </a>
            </p>
          </address>
        </div>
      </div>
      <div className="border-t border-white/10 px-5 py-5 text-center text-xs text-white/60">
        © {new Date().getFullYear()} {site.name}. All rights reserved.
      </div>
    </footer>
  );
}
