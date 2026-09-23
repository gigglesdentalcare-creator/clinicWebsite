import { ExternalLink } from "lucide-react";
import { Image } from "next-sanity/image";
import { RevealItem } from "@/components/motion/Reveal";
import ReadMore from "@/components/ui/ReadMore";
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

// One row of the /recommendations page: product image on one side, details on the other.
// `reverse` flips the sides on desktop so consecutive rows alternate; on mobile the image
// always sits on top.
export default function ProductRow({ product, reverse }: { product: Product; reverse: boolean }) {
  return (
    <RevealItem
      className={`flex flex-col gap-8 md:items-center md:gap-14 ${reverse ? "md:flex-row-reverse" : "md:flex-row"}`}
    >
      <div className="w-full md:w-2/5 md:shrink-0">
        <div className="aspect-square w-full overflow-hidden rounded-card bg-white">
          <Image
            src={product.image.url}
            alt={product.image.alt ?? product.name}
            width={product.image.width}
            height={product.image.height}
            sizes="(min-width: 768px) 40vw, 100vw"
            className="size-full object-contain p-8"
          />
        </div>
      </div>

      <div className="md:w-3/5">
        {product.brand && (
          <p className="text-sm font-semibold uppercase tracking-wider text-primary-text">{product.brand}</p>
        )}
        <h2 className="mt-1 text-3xl font-semibold text-ink md:text-4xl">{product.name}</h2>
        <div className="mt-5 whitespace-pre-line leading-relaxed text-muted">
          <ReadMore clampClassName="line-clamp-4">{product.description}</ReadMore>
        </div>
        <a
          href={product.link}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-primary-dark"
        >
          View product
          <ExternalLink size={16} aria-hidden />
        </a>
      </div>
    </RevealItem>
  );
}
