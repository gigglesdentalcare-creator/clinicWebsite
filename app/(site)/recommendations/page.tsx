import type { Metadata } from "next";
import ProductCard, { type Product } from "@/components/recommendations/ProductCard";
import { Reveal, RevealGroup } from "@/components/motion/Reveal";
import { fetchContent } from "@/sanity/lib/fetch";
import { productCategoriesQuery, recommendationsPageQuery } from "@/sanity/lib/queries";
import { tagsFor } from "@/sanity/lib/tags";
import type { ProductCategoriesQueryResult } from "@/sanity.types";

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

type RawProduct = NonNullable<ProductCategoriesQueryResult[number]["products"]>[number];

// The query already skips products without a link/name/photo, but Sanity's generated types stay
// nullable (and an image's dimensions could still be missing), so narrow them here.
function isComplete(product: RawProduct): product is RawProduct & Product {
  return Boolean(product.name && product.link && product.image?.url && product.image.width && product.image.height);
}

type Category = { _id: string; title: string; description: string | null; products: Product[] };

// Categories with no finished products yet are left out, so an empty heading never shows.
async function getCategories(): Promise<Category[]> {
  try {
    const data = await fetchContent({ query: productCategoriesQuery, tags: tagsFor("productCategory") });
    return (data ?? [])
      .map((category) => ({
        _id: category._id,
        title: category.title ?? "",
        description: category.description,
        products: (category.products ?? []).filter(isComplete),
      }))
      .filter((category) => category.title && category.products.length > 0);
  } catch (error) {
    console.error("Could not load recommended products from Sanity.", error);
    return [];
  }
}

// In-page anchor for a category, e.g. "Kids' toothbrushes" → "kids-toothbrushes".
const anchorFor = (title: string) =>
  title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "products";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getRecommendationsPage();
  return { title: page.title, description: page.intro };
}

export default async function RecommendationsPage() {
  const [page, categories] = await Promise.all([getRecommendationsPage(), getCategories()]);

  return (
    <>
      <section className="mx-auto max-w-6xl px-5 pb-10 pt-14 md:pt-24">
        <Reveal>
          <h1 className="max-w-3xl text-4xl font-semibold leading-tight text-ink md:text-6xl">{page.title}</h1>
          {page.intro && <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">{page.intro}</p>}
          {categories.length > 1 && (
            <nav aria-label="Product categories" className="mt-8 flex flex-wrap gap-2">
              {categories.map((category) => (
                <a
                  key={category._id}
                  href={`#${anchorFor(category.title)}`}
                  className="rounded-full bg-primary-soft px-4 py-2 text-sm font-medium text-primary-dark transition-colors hover:bg-primary hover:text-white"
                >
                  {category.title}
                </a>
              ))}
            </nav>
          )}
        </Reveal>
      </section>

      <div className="mx-auto max-w-6xl px-5 pb-20 md:pb-28">
        {categories.length > 0 ? (
          <div className="flex flex-col gap-16 md:gap-20">
            {categories.map((category) => (
              <section key={category._id} id={anchorFor(category.title)} className="scroll-mt-24">
                <Reveal>
                  <h2 className="text-2xl font-semibold text-ink md:text-4xl">{category.title}</h2>
                  {category.description && <p className="mt-2 max-w-2xl leading-relaxed text-muted">{category.description}</p>}
                </Reveal>
                <RevealGroup className="mt-6 grid grid-cols-2 gap-4 md:mt-8 md:grid-cols-3 md:gap-5 lg:grid-cols-4">
                  {category.products.map((product) => (
                    <ProductCard key={product._key} product={product} />
                  ))}
                </RevealGroup>
              </section>
            ))}
          </div>
        ) : (
          // Editors haven't added any products in Studio yet.
          <p className="rounded-card bg-primary/5 p-8 text-center text-muted">
            No products added yet — add a &ldquo;Product category&rdquo; in the Studio and paste product links into it.
          </p>
        )}
      </div>
    </>
  );
}
