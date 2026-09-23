import type { Metadata } from "next";
import ProductRow, { type Product } from "@/components/recommendations/ProductRow";
import { Reveal, RevealGroup } from "@/components/motion/Reveal";
import { fetchContent } from "@/sanity/lib/fetch";
import { recommendationsPageQuery, recommendedProductsQuery } from "@/sanity/lib/queries";
import { tagsFor } from "@/sanity/lib/tags";
import type { RecommendedProductsQueryResult } from "@/sanity.types";

const defaults = {
  title: "Recommended Products",
  intro: "A few products our dentists trust and recommend to patients.",
};

// Falls back to sensible defaults if the singleton hasn't been created in Studio yet, or if
// Sanity can't be reached — same defensive pattern as lib/site-info.ts's getSiteInfo().
async function getRecommendationsPage() {
  try {
    const data = await fetchContent({ query: recommendationsPageQuery, tags: tagsFor("recommendationsPage") });
    return { title: data?.title ?? defaults.title, intro: data?.intro ?? defaults.intro };
  } catch (error) {
    console.error("Could not load the recommendations page from Sanity, using defaults.", error);
    return defaults;
  }
}

// Schema requires name/description/link/image, but Sanity's generated types stay nullable for
// every field regardless (see components/recommendations/ProductRow.tsx) — skip any document
// still missing one, e.g. a draft an editor hasn't finished filling in, rather than render a
// broken card.
function isComplete(product: RecommendedProductsQueryResult[number]): product is Product {
  return Boolean(
    product.name && product.description && product.link && product.image?.url && product.image.width && product.image.height,
  );
}

async function getProducts(): Promise<Product[]> {
  try {
    const data = await fetchContent({ query: recommendedProductsQuery, tags: tagsFor("recommendedProduct") });
    return (data ?? []).filter(isComplete);
  } catch (error) {
    console.error("Could not load recommended products from Sanity.", error);
    return [];
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await getRecommendationsPage();
  return { title: page.title, description: page.intro };
}

export default async function RecommendationsPage() {
  const [page, products] = await Promise.all([getRecommendationsPage(), getProducts()]);

  return (
    <>
      <section className="mx-auto max-w-6xl px-5 pb-10 pt-14 md:pt-24">
        <Reveal>
          <h1 className="max-w-3xl text-4xl font-semibold leading-tight text-ink md:text-6xl">{page.title}</h1>
          {page.intro && <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">{page.intro}</p>}
        </Reveal>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-20 md:pb-28">
        {products.length > 0 ? (
          // Rows alternate: image left / details right, then the reverse, and so on.
          <div className="flex flex-col gap-16 md:gap-24">
            {products.map((product, index) => (
              <RevealGroup key={product._id}>
                <ProductRow product={product} reverse={index % 2 === 1} />
              </RevealGroup>
            ))}
          </div>
        ) : (
          // Editors haven't added any products in Studio yet.
          <p className="rounded-card bg-primary/5 p-8 text-center text-muted">
            No products added yet — add some under &ldquo;Recommended product&rdquo; in the Studio.
          </p>
        )}
      </section>
    </>
  );
}
