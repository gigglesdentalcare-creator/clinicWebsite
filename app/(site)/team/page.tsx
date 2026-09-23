import type { Metadata } from "next";
import DoctorRow, { type Doctor } from "@/components/team/DoctorRow";
import { Reveal, RevealGroup } from "@/components/motion/Reveal";
import { site } from "@/lib/site";
import { fetchContent } from "@/sanity/lib/fetch";
import { doctorsQuery } from "@/sanity/lib/queries";
import { tagsFor } from "@/sanity/lib/tags";
import type { DoctorsQueryResult } from "@/sanity.types";

export const metadata: Metadata = {
  title: "Our Team",
  description: `Meet the dentists at ${site.name} — gentle, experienced care for kids and adults alike.`,
};

// `name` is required in the schema, but Sanity's generated types stay nullable regardless (a
// document could be a draft, or predate the rule) — skip any doctor still missing one rather
// than render a nameless card.
function hasName(doctor: DoctorsQueryResult[number]): doctor is Doctor {
  return Boolean(doctor.name);
}

async function getDoctors(): Promise<Doctor[]> {
  try {
    const data = await fetchContent({ query: doctorsQuery, tags: tagsFor("doctor") });
    return (data ?? []).filter(hasName);
  } catch (error) {
    console.error("Could not load the team from Sanity.", error);
    return [];
  }
}

export default async function TeamPage() {
  const doctors = await getDoctors();

  return (
    <>
      <section className="mx-auto max-w-6xl px-5 pb-10 pt-14 md:pt-24">
        <Reveal>
          <h1 className="max-w-2xl text-4xl font-semibold leading-tight text-ink md:text-6xl">Our Team</h1>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted">
            Gentle, experienced dentists who treat every patient like family — from a child&apos;s first visit to a
            grandparent&apos;s check-up.
          </p>
        </Reveal>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-20 md:pb-28">
        {doctors.length > 0 ? (
          // Rows alternate: photo left / details right, then the reverse, and so on.
          <div className="flex flex-col gap-16 md:gap-24">
            {doctors.map((doctor, index) => (
              <RevealGroup key={doctor._id}>
                <DoctorRow doctor={doctor} reverse={index % 2 === 1} />
              </RevealGroup>
            ))}
          </div>
        ) : (
          // Editors haven't added any doctors in Studio yet.
          <p className="rounded-card bg-primary/5 p-8 text-center text-muted">
            Our team profiles are coming soon — add doctors under &ldquo;Doctor&rdquo; in the Studio.
          </p>
        )}
      </section>
    </>
  );
}
