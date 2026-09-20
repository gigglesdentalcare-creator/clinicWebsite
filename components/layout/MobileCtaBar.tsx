import { CalendarHeart, MessageCircle, Phone } from "lucide-react";
import Link from "next/link";
import { type SiteInfo, whatsappLink } from "@/lib/site";

// Sticky bottom bar shown on mobile only: Call · WhatsApp · Book.
export default function MobileCtaBar({ info }: { info: SiteInfo }) {
  const base =
    "flex flex-1 flex-col items-center justify-center gap-0.5 py-2.5 text-xs font-semibold";

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-50 flex border-t border-ink/10 bg-background/95 backdrop-blur md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <a href={`tel:${info.phone}`} className={`${base} text-ink`}>
        <Phone size={20} aria-hidden /> Call
      </a>
      <a
        href={whatsappLink(info.whatsapp)}
        target="_blank"
        rel="noopener noreferrer"
        className={`${base} text-primary-dark`}
      >
        <MessageCircle size={20} aria-hidden /> WhatsApp
      </a>
      <Link href="/book" className={`${base} bg-primary text-white`}>
        <CalendarHeart size={20} aria-hidden /> Book
      </Link>
    </div>
  );
}
