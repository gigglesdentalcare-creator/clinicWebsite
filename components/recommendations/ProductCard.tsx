import { ExternalLink } from "lucide-react";
import { Image } from "next-sanity/image";
import { RevealItem } from "@/components/motion/Reveal";
import type { RecommendedProductsQueryResult } from "@/sanity.types";

// `name`/`description`/`link`/`image` are required in the schema, but Sanity's generated types
// stay nullable for every field (a document could predate the validation rule, or be a draft) —
// the page filters those out before any Product reaches this component, so they're narrowed
// to non-null here. `brand` is genuinely optional.
type RawProduct = RecommendedProductsQueryResult[number];
export type Product = Omit<RawProduct, "name" | "description" | "link" | "image"> & {
  name: string;
  description: string;
  link: string;
  image: { url: string; width: number; height: number; alt: string | null };
};

export default function ProductCard({ product }: { product: Product }) {
  return (
    <RevealItem>
      <a
        href={product.link}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex h-full flex-col overflow-hidden rounded-card bg-primary/5 transition duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-ink/10"
      >
        <div className="aspect-square w-full overflow-hidden bg-white">
          <Image
            src={product.image.url}
            alt={product.image.alt ?? product.name}
            width={product.image.width}
            height={product.image.height}
            sizes="(min-width: 768px) 25vw, 50vw"
            className="size-full object-contain p-6 transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div className="flex flex-1 flex-col p-6">
          {product.brand && (
            <p className="text-xs font-semibold uppercase tracking-wider text-primary-text">{product.brand}</p>
          )}
          <h3 className="mt-1 text-lg font-semibold text-ink">{product.name}</h3>
          <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{product.description}</p>
          <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-ink">
            View product
            <ExternalLink size={14} aria-hidden className="transition-transform duration-300 group-hover:translate-x-0.5" />
          </span>
        </div>
      </a>
    </RevealItem>
  );
}
