import { ExternalLink } from "lucide-react";
import { Image } from "next-sanity/image";
import { RevealItem } from "@/components/motion/Reveal";

export type Product = {
  _key: string;
  name: string;
  link: string;
  note: string | null;
  image: { url: string; width: number; height: number };
};

// "View on Amazon" for Amazon links (including amzn.to / amzn.in short links), else generic.
function linkLabel(link: string) {
  try {
    const host = new URL(link).hostname;
    if (/(^|\.)(amazon\.[a-z.]+|amzn\.[a-z]+|a\.co)$/i.test(host)) return "View on Amazon";
    if (/(^|\.)flipkart\.com$/i.test(host)) return "View on Flipkart";
  } catch {}
  return "View product";
}

// One product on /recommendations: the whole card links out to the shop. Shop titles are often
// very long, so the name is clamped to three lines (the full name is in the tooltip).
export default function ProductCard({ product }: { product: Product }) {
  return (
    <RevealItem className="h-full">
      <a
        href={product.link}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex h-full flex-col overflow-hidden rounded-card bg-primary/5 ring-1 ring-ink/5 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-ink/10"
      >
        {/* White in both themes: product photos are shot on white. */}
        <div className="aspect-square w-full bg-white">
          <Image
            src={product.image.url}
            alt=""
            width={product.image.width}
            height={product.image.height}
            sizes="(min-width: 1024px) 270px, (min-width: 768px) 33vw, 50vw"
            className="size-full object-contain p-5 md:p-7"
          />
        </div>
        <div className="flex flex-1 flex-col p-4 md:p-5">
          <h3 title={product.name} className="line-clamp-3 text-sm font-semibold leading-snug text-ink md:text-base">
            {product.name}
          </h3>
          {product.note && <p className="mt-2 text-sm leading-relaxed text-muted">{product.note}</p>}
          <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-semibold text-primary-text">
            {linkLabel(product.link)}
            <ExternalLink size={14} aria-hidden className="transition-transform duration-300 group-hover:translate-x-0.5" />
            <span className="sr-only">(opens in a new tab)</span>
          </span>
        </div>
      </a>
    </RevealItem>
  );
}
