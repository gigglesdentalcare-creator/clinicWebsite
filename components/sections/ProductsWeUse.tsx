import { Plus } from "lucide-react";
import { PortableText, type PortableTextComponents } from "next-sanity";
import { Image } from "next-sanity/image";
import Link from "next/link";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import type { ProductsWeUseQueryResult } from "@/sanity.types";

type Item = NonNullable<NonNullable<ProductsWeUseQueryResult>["items"]>[number];

export type ProductsWeUseContent = { title: string; intro: string | null; items: Item[] };

// Links typed in Studio: pages on this site stay in the tab, anything else opens a new one.
const components: PortableTextComponents = {
  marks: {
    link: ({ value, children }) => {
      const href: string = value?.href ?? "";
      const className = "font-semibold underline decoration-white/50 underline-offset-2 hover:decoration-white";
      return href.startsWith("/") ? (
        <Link href={href} className={className}>
          {children}
        </Link>
      ) : (
        <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
          {children}
        </a>
      );
    },
  },
  block: { normal: ({ children }) => <p>{children}</p> },
};

// Home page grid of the brands/materials the clinic works with (Home page → "Products we use" in
// Studio). Each block's text slides over it on hover. Touch screens have no hover, so the block
// is also focusable: a tap (or keyboard Tab) focuses it and `group-focus-within` shows the text,
// which keeps its links clickable. The text is `invisible` while hidden so its links can't be
// clicked or tabbed to by accident.
export default function ProductsWeUse({ content }: { content: ProductsWeUseContent }) {
  return (
    <section className="mx-auto max-w-6xl px-5 py-16 md:py-24">
      <Reveal className="max-w-2xl">
        <h2 className="text-3xl font-semibold text-ink md:text-5xl">{content.title}</h2>
        {content.intro && <p className="mt-4 text-lg leading-relaxed text-muted">{content.intro}</p>}
      </Reveal>

      <RevealGroup className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-5 lg:grid-cols-4">
        {content.items.map((item) => {
          const { url, width, height } = item.image ?? {};
          const image = url && width && height ? { url, width, height } : null;
          return (
            <RevealItem key={item._key} className="h-full">
              <div
                tabIndex={0}
                className="group relative flex h-full flex-col overflow-hidden rounded-card bg-primary/5 ring-1 ring-ink/5 outline-none transition duration-300 hover:shadow-xl hover:shadow-ink/10 focus-visible:ring-2 focus-visible:ring-primary"
              >
                {/* White in both themes: logos and product shots are made for a light background. */}
                <div className="relative flex aspect-[4/3] items-center justify-center bg-white">
                  {image ? (
                    <Image
                      src={image.url}
                      alt=""
                      width={image.width}
                      height={image.height}
                      sizes="(min-width: 1024px) 270px, (min-width: 768px) 33vw, 50vw"
                      className="absolute inset-0 size-full object-contain p-5 md:p-7"
                    />
                  ) : (
                    <span aria-hidden className="px-4 text-center font-display text-2xl font-semibold text-navy">
                      {item.name}
                    </span>
                  )}
                </div>
                <div className="flex flex-1 items-center justify-between gap-2 p-4 md:p-5">
                  <h3 className="text-sm font-semibold leading-snug text-ink md:text-base">{item.name}</h3>
                  {item.text && item.text.length > 0 && (
                    <Plus size={18} aria-hidden className="shrink-0 text-primary-text" />
                  )}
                </div>

                {item.text && item.text.length > 0 && (
                  <div className="invisible absolute inset-0 overflow-y-auto bg-navy p-5 text-sm leading-relaxed text-white opacity-0 transition duration-300 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100 md:p-6">
                    <p aria-hidden className="font-display text-lg font-semibold">
                      {item.name}
                    </p>
                    <div className="mt-2 space-y-2 text-white/85">
                      <PortableText value={item.text} components={components} />
                    </div>
                  </div>
                )}
              </div>
            </RevealItem>
          );
        })}
      </RevealGroup>
    </section>
  );
}
