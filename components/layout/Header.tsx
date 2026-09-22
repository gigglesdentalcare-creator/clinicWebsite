"use client";

import { Menu, Phone, X } from "lucide-react";
import Link from "next/link";
import { Image } from "next-sanity/image";
import { useState } from "react";
import ThemeToggle from "@/components/theme/ThemeToggle";
import { navLinks, type SiteInfo } from "@/lib/site";

export default function Header({ info }: { info: SiteInfo }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-ink/5 bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 md:h-20">
        <Link
          href="/"
          className="flex items-center gap-2.5 font-display text-xl font-semibold text-ink md:text-2xl"
          onClick={() => setOpen(false)}
        >
          {info.logo && (
            // White badge regardless of theme: the logo is drawn for a light background, so on
            // a dark page (dark mode) its black outline would nearly vanish without one — see
            // the same treatment on the footer logo.
            <span className="inline-flex rounded-xl bg-white p-1">
              <Image
                src={info.logo.url}
                alt=""
                width={info.logo.width}
                height={info.logo.height}
                sizes="40px"
                loading="eager"
                className="h-8 w-auto md:h-10"
              />
            </span>
          )}
          {info.name}
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted transition-colors hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={`tel:${info.phone}`}
            className="hidden items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-ink hover:bg-primary/10 lg:inline-flex"
          >
            <Phone size={16} aria-hidden /> {info.phoneDisplay}
          </a>
          <Link
            href="/book"
            className="hidden rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark md:inline-flex"
          >
            Book appointment
          </Link>
          <ThemeToggle />
          <button
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-full text-ink hover:bg-primary/10 md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <nav
          id="mobile-menu"
          aria-label="Mobile"
          className="border-t border-ink/5 bg-background px-5 pb-6 pt-2 md:hidden"
        >
          <ul className="flex flex-col">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block border-b border-ink/5 py-4 text-lg font-medium text-ink"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
