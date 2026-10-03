import type { Metadata } from "next";
import { Reveal, RevealGroup } from "@/components/motion/Reveal";
import SmileCaseCard from "@/components/smile-stories/SmileCaseCard";
import { fetchContent } from "@/sanity/lib/fetch";
import { smileCasesQuery, smileStoriesPageQuery } from "@/sanity/lib/queries";
import { tagsFor } from "@/sanity/lib/tags";

const defaults = {
  title: "Smile Stories",
  intro: "Real results from our patients. Drag the slider to compare before and after.",
};

// Same defensive pattern as the recommendations page: defaults if the singleton is missing or
// Sanity can't be reached.
async function getSmileStoriesPage() {
  try {
    const data = await fetchContent({ query: smileStoriesPageQuery, tags: tagsFor("smileStoriesPage") });
    return { title: data?.title ?? defaults.title, intro: data?.intro ?? defaults.intro };
  } catch (error) {
    console.error("Could not load the smile stories page from Sanity, using defaults.", error);
    return defaults;
  }
}

async function getCases() {
  try {
    return (await fetchContent({ query: smileCasesQuery, tags: tagsFor("smileCase") })) ?? [];
  } catch (error) {
    console.error("Could not load smile stories from Sanity.", error);
    return [];
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await getSmileStoriesPage();
  return { title: page.title, description: page.intro };
}

export default async function SmileStoriesPage() {
  const [page, cases] = await Promise.all([getSmileStoriesPage(), getCases()]);

  return (
    <>
      <section className="mx-auto max-w-6xl px-5 pb-10 pt-14 md:pt-24">
        <Reveal>
          <h1 className="max-w-3xl text-4xl font-semibold leading-tight text-ink md:text-6xl">{page.title}</h1>
          {page.intro && <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">{page.intro}</p>}
        </Reveal>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-20 md:pb-28">
        {cases.length > 0 ? (
          <RevealGroup className="grid gap-x-8 gap-y-14 md:grid-cols-2">
            {cases.map((smileCase) => (
              <SmileCaseCard key={smileCase._id} smileCase={smileCase} sizes="(min-width: 1152px) 540px, (min-width: 768px) 50vw, 100vw" />
            ))}
          </RevealGroup>
        ) : (
          <p className="rounded-card bg-primary/5 p-8 text-center text-muted">
            No smile stories yet — add one under &ldquo;Smile story&rdquo; in the Studio.
          </p>
        )}
      </section>
    </>
  );
}
